# Spike S4 - one rule module (targeting & countering), two strategies, a test table.
# Throwaway spike code (SPIKES.md). Written in Windows PowerShell 5.1 because the host has no Node/Python
# and nothing may be installed unattended. The product language stays TypeScript (ADR-0001).
# Run:  powershell -ExecutionPolicy Bypass -File spikes\s4\s4.ps1

$ErrorActionPreference = 'Stop'
$F = Get-Content -Raw (Join-Path $PSScriptRoot 'features.json') | ConvertFrom-Json

# ---------- stack objects ----------
# A stack object: @{ kind='spell'|'ability'; card=<name>; mode=<mode id>; abilityIndex=<n>; created=<bool>; id=<string> }
function Get-Def($obj) {
  $c = $F.($obj.card)
  if ($obj.kind -eq 'spell') { if ($obj.mode) { return $c.modes.($obj.mode) } else { return $c.effect } }
  $a = $c.abilities[[int]$obj.abilityIndex]
  if ($obj.created) { return $a.creates[0] } else { return $a }
}
function Get-TargetCount($obj) { @((Get-Def $obj).targets).Count }            # CR 115.1a-d, 115.10a

# ---------- rule module: targeting & countering ----------
function Test-LegalTarget($spec, $obj, $self) {
  $cites = @()
  if ($self -and $obj.id -eq $self.id) { return @{ legal = $false; cites = @('CR:115.5') } }
  $card = $F.($obj.card)
  switch ($spec.what) {
    'spell-or-ability' { $ok = $obj.kind -in @('spell', 'ability'); $cites += 'CR:113.1c', 'CR:115.2' }
    'spell'            { $ok = $obj.kind -eq 'spell'; if ($obj.kind -eq 'ability') { $cites += 'CR:113.9' } }
    'creature'         { $ok = $obj.kind -eq 'permanent' -and ($card.types -contains 'creature') }
    'permanent'        { $ok = $obj.kind -eq 'permanent' }
    default            { throw "unknown target kind $($spec.what)" }
  }
  if ($ok -and $spec.restriction) {
    switch ($spec.restriction) {
      'blue'          { $ok = $card.colors -contains 'U' }
      'noncreature'   { $ok = -not ($card.types -contains 'creature') }
      'single-target' { $ok = (Get-TargetCount $obj) -eq 1 }
      'nonland-mv3'   { $ok = $true }  # not exercised by this family
    }
  }
  @{ legal = [bool]$ok; cites = $cites }
}

function Find-LegalTargets($spec, $candidates, $self) {                     # CR 601.2c
  @($candidates | Where-Object { (Test-LegalTarget $spec $_ $self).legal })
}

# Redirect effects on a targeted object. $proposal = the object the player wants as the new target.
function Invoke-Redirect($kind, $obj, $proposal) {
  $n = Get-TargetCount $obj
  if ($n -eq 0) { return @{ outcome = 'no-effect'; cites = @('CR:115.7d') } }     # nothing to change
  $spec = @((Get-Def $obj).targets)[0]                                           # mode is fixed: CR 700.2a, 601.2b
  $legal = (Test-LegalTarget $spec $proposal $obj).legal
  $rule = if ($kind -eq 'choose-new-targets') { 'CR:115.7d' } else { 'CR:115.7a' }
  if ($legal) { @{ outcome = 'changed'; cites = @($rule) } } else { @{ outcome = 'unchanged'; cites = @($rule, 'CR:700.2a') } }
}

# Counter effects. Returns what happens when the counterspell tries to resolve.
function Get-CounterOutcome($counterCard, $mode, $target, [bool]$targetLegalOnResolution, [bool]$counterItselfCountered) {
  $def = if ($mode) { $F.$counterCard.modes.$mode } else { $F.$counterCard.effect }
  if ($counterItselfCountered) { return @{ resolves = $false; countered = $false; additional = $false; cites = @('CR:701.6a') } }
  if (-not $targetLegalOnResolution) { return @{ resolves = $false; countered = $false; additional = $false; cites = @('CR:608.2b') } }
  $tc = $F.($target.card)
  $countered = [bool]$tc.canBeCountered
  if ($def.kind -eq 'counter-if-blue') { $countered = $countered -and ($tc.colors -contains 'U') }
  $cites = @('CR:608.2b', 'CR:608.2c')
  if (-not $tc.canBeCountered) { $cites += 'CR:101.2', 'CR:113.6g', 'CR:609.3' }
  $additional = [bool]$def.additionalEffects
  if ($def.creates) { $cites += 'CR:603.7a' }
  @{ resolves = $true; countered = $countered; additional = $additional; cites = $cites }
}

# ---------- strategies (ADR-0017) ----------
# S-A "can X target Y, and what happens?"  S-B "counter effect vs can't be countered"
function Invoke-Strategy($t) {
  $x = $F.($t.x)
  $def = if ($t.mode) { $x.modes.($t.mode) } else { $x.effect }
  $spec = @($def.targets)[0]
  $self = @{ kind = 'spell'; card = $t.x; mode = $t.mode; id = 'X' }
  if ($t.stack) {                                             # "can it be cast at all?"
    $legal = Find-LegalTargets $spec $t.stack $self
    return @{ castable = ($legal.Count -gt 0) }
  }
  $r = Test-LegalTarget $spec $t.y $self
  $res = @{ legal = $r.legal }
  if (-not $r.legal) { return $res }
  if ($def.kind -in @('choose-new-targets', 'change-the-target')) { $res.redirect = (Invoke-Redirect $def.kind $t.y $t.proposal).outcome }
  if ($def.kind -in @('counter', 'counter-if-blue')) {
    $o = Get-CounterOutcome $t.x $t.mode $t.y ($t.legalOnResolution -ne $false) ([bool]$t.xCountered)
    $res.resolves = $o.resolves; $res.countered = $o.countered; $res.additional = $o.additional
  }
  $res
}

# ---------- test table (expected = the case files' answers) ----------
$spell  = { param($c, $m) @{ kind = 'spell'; card = $c; mode = $m; id = "s-$c" } }
$perm   = { param($c) @{ kind = 'permanent'; card = $c; id = "p-$c" } }
$necroD = @{ kind = 'ability'; card = 'Necropotence'; abilityIndex = 0; created = $true; id = 'necro-delayed' }
$necroA = @{ kind = 'ability'; card = 'Necropotence'; abilityIndex = 0; created = $false; id = 'necro-act' }
$thassaT = @{ kind = 'ability'; card = "Thassa's Oracle"; abilityIndex = 0; id = 'thassa-etb' }
$rebOnBlue = & $spell 'Red Elemental Blast' 'counter'

$tests = @(
  @{ id = 'deflecting-swat-necropotence-delayed-trigger'; x = 'Deflecting Swat'; y = $necroD; proposal = $null; expect = @{ legal = $true; redirect = 'no-effect' } },
  @{ id = 'pact-of-negation-uncounterable-spell'; x = 'Pact of Negation'; y = (& $spell 'Abrupt Decay'); expect = @{ legal = $true; resolves = $true; countered = $false; additional = $true } },
  @{ id = 'tc-01'; x = 'Deflecting Swat'; y = (& $spell 'Swords to Plowshares'); proposal = (& $perm "Thassa's Oracle"); expect = @{ legal = $true; redirect = 'changed' } },
  @{ id = 'tc-02'; x = 'Deflecting Swat'; y = $necroA; expect = @{ legal = $true; redirect = 'no-effect' } },
  @{ id = 'tc-03'; x = 'Deflecting Swat'; stack = @(@{ kind = 'spell'; card = 'Deflecting Swat'; id = 'X' }); expect = @{ castable = $false } },
  @{ id = 'tc-04a (onto Rhystic Study)'; x = 'Deflecting Swat'; y = $rebOnBlue; proposal = (& $perm 'Rhystic Study'); expect = @{ legal = $true; redirect = 'unchanged' } },
  @{ id = 'tc-04b (onto non-blue spell)'; x = 'Deflecting Swat'; y = $rebOnBlue; proposal = (& $spell 'Swords to Plowshares'); expect = @{ legal = $true; redirect = 'unchanged' } },
  @{ id = 'tc-04c (onto another blue spell)'; x = 'Deflecting Swat'; y = $rebOnBlue; proposal = (& $spell 'Counterspell'); expect = @{ legal = $true; redirect = 'changed' } },
  @{ id = 'tc-05'; x = 'Pyroblast'; mode = 'counter'; y = (& $spell 'Deflecting Swat'); expect = @{ legal = $true; resolves = $true; countered = $false } },
  @{ id = 'tc-05 contrast (REB)'; x = 'Red Elemental Blast'; mode = 'counter'; y = (& $spell 'Deflecting Swat'); expect = @{ legal = $false } },
  @{ id = 'tc-06'; x = 'Pact of Negation'; y = (& $spell 'Abrupt Decay'); legalOnResolution = $false; expect = @{ legal = $true; resolves = $false; additional = $false } },
  @{ id = 'tc-07'; x = 'Pact of Negation'; y = (& $spell 'Counterspell'); xCountered = $true; expect = @{ legal = $true; resolves = $false; additional = $false } },
  @{ id = 'tc-08'; x = 'Pact of Negation'; y = $thassaT; expect = @{ legal = $false } },
  @{ id = 'tc-09'; x = 'Mana Drain'; y = (& $spell 'Abrupt Decay'); expect = @{ legal = $true; resolves = $true; countered = $false; additional = $true } },
  @{ id = 'tc-10'; x = 'Counterspell'; y = (& $spell 'Abrupt Decay'); expect = @{ legal = $true; resolves = $true; countered = $false; additional = $false } },
  # generalisation: cards added to features.json only after the code was written
  @{ id = 'gen-1 Force of Will vs Abrupt Decay'; gen = $true; x = 'Force of Will'; y = (& $spell 'Abrupt Decay'); expect = @{ legal = $true; resolves = $true; countered = $false } },
  @{ id = 'gen-2 Misdirection vs Necro delayed trigger'; gen = $true; x = 'Misdirection'; y = $necroD; expect = @{ legal = $false } },
  @{ id = 'gen-3 Misdirection vs Swords'; gen = $true; x = 'Misdirection'; y = (& $spell 'Swords to Plowshares'); proposal = (& $perm "Thassa's Oracle"); expect = @{ legal = $true; redirect = 'changed' } },
  @{ id = 'gen-4 Fierce Guardianship vs creature spell'; gen = $true; x = 'Fierce Guardianship'; y = (& $spell "Thassa's Oracle"); expect = @{ legal = $false } },
  @{ id = 'gen-5 Fierce Guardianship vs Pact'; gen = $true; x = 'Fierce Guardianship'; y = (& $spell 'Pact of Negation'); expect = @{ legal = $true; resolves = $true; countered = $true } }
)

$pass = 0; $fail = 0
foreach ($t in $tests) {
  $got = Invoke-Strategy $t
  $bad = @($t.expect.Keys | Where-Object { "$($got[$_])" -ne "$($t.expect[$_])" })
  $tag = if ($t.gen) { '[gen]' } else { '     ' }
  if ($bad.Count -eq 0) { $pass++; Write-Output "PASS $tag $($t.id)" }
  else { $fail++; Write-Output ("FAIL $tag $($t.id): " + (($bad | ForEach-Object { "$_ expected $($t.expect[$_]) got $($got[$_])" }) -join '; ')) }
}
Write-Output "`n$pass passed, $fail failed, $($tests.Count) total"
if ($fail) { exit 1 }
