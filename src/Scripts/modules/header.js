const $header = document.querySelector('header');

if ($header) {
	// Mobile menu
	const $menuToggle = $header.querySelector('.toggle-menu');
	if ($menuToggle) {
		$menuToggle.addEventListener('click', () => {
			$header.classList.toggle('menu-open');
		});
	}

	// Desktop lang switch
	const $langSwitch = $header.querySelector('.lang-switch');
	const $langSwitchBtn = $langSwitch.querySelector('li:first-child');
	$langSwitchBtn.addEventListener('click', () => {
		$langSwitch.classList.toggle('open');
	});
}
