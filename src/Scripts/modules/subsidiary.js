document.addEventListener('DOMContentLoaded', () => {
	const $sSubsidiary = document.querySelector('.screen--subsidiary');
	const $subDescription = $sSubsidiary.querySelector('.description');
	const $openSubDescription = $sSubsidiary.querySelector('.openDescription');
	const $closeSubDescription = $sSubsidiary.querySelector('.closeDescription');
	const $form = $sSubsidiary.querySelector('#subsidiaryForm');
	const $input = $form.querySelector('#Subsidiary');
	const $error = $form.querySelector('#Subsidiary-error');

	$openSubDescription.addEventListener('click', () => {
		$subDescription.classList.add('open');
	});
	$closeSubDescription.addEventListener('click', () => {
		$subDescription.classList.remove('open');
	});

	let subsidiarySubmitted = false;

	$form.noValidate = true;
	$form.addEventListener('submit', (ev) => {
		ev.preventDefault();

		if (
			!subsidiarySubmitted &&
			$form.checkValidity() &&
			$input.value !== '' &&
			/^\d+$/.test($input.value)
		) {
			subsidiarySubmitted = true;
			$error.innerHTML = '';
			$form.submit();
		} else {
			$error.innerHTML = $input.dataset.msg;
		}
	});
});
