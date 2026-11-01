export function LocationScenery({ index }: { index: number }) {
  return <svg viewBox="0 0 400 100" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><g fill="currentColor">{[
<><path d="M0 100V62h30V34h22v28h26V46h18v54h40V20h8V4h4v16h8v80h24V52h30V36h24v64h28V58h36V70h40v30z"/></>,
<><rect x="150" y="8" width="100" height="92"/><path d="M160 24h80M160 38h80M160 52h80M160 66h80M160 80h80" stroke="#fff" strokeOpacity=".6" strokeWidth="2"/><path d="M0 100V80h140v20zM260 80h140v20H260z"/></>,
<><path d="M120 100V58l60-28 60 28v42z"/><path d="M0 84q50-12 100 0t100 0 100 0 100 0M0 94q50-10 100 0t100 0 100 0 100 0" fill="none" stroke="currentColor" strokeWidth="3"/></>,
<><path d="M0 0L170 38V70L0 100zM400 0L230 38V70L400 100zM170 38H230V70H170z"/></>,
<><circle cx="200" cy="110" r="96" fill="none" stroke="currentColor" strokeWidth="6"/><circle cx="200" cy="110" r="60" fill="none" stroke="currentColor" strokeWidth="6"/><path d="M0 100l20-40 20 40 20-30 20 30 20-50 20 50zM240 100l20-50 20 50 20-30 20 30 20-40 20 40 20-30 20 30z"/></>,
<><path d="M30 100V44h340v56z"/><path d="M190 44l10-30 10 30z"/><circle cx="200" cy="36" r="9" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M50 62h30M50 78h30M110 62h30M110 78h30M260 62h30M260 78h30M320 62h30M320 78h30" stroke="#fff" strokeOpacity=".55" strokeWidth="3"/></>
][index]}</g></svg>;
}
