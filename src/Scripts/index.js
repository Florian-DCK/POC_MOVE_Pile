import '../Content/css/index.scss';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@hilarious-be/joystick/styles/default.css';

import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { logReadyMessage } from './utils';

document.addEventListener('DOMContentLoaded', () => {
	logReadyMessage();

	const $header = document.querySelector('header');

	if ($header) {
		// Mobile menu
		$header.querySelector('.toggle-menu')?.addEventListener('click', () => {
			$header.classList.toggle('menu-open');
		});

		// Desktop lang switch
		const $langSwitch = $header.querySelector('.lang-switch');
		$langSwitch
			?.querySelector('li:first-child')
			?.addEventListener('click', () => {
				$langSwitch.classList.toggle('open');
			});
	}

	// Gifts popup
	const $showGiftsBtn = document.querySelector('.btn-gifts-open');
	const $giftsOverlay = document.querySelector('.gifts-overlay');
	const $closeGiftsBtn = $giftsOverlay.querySelector('.btn-gifts-close');

	$showGiftsBtn.addEventListener('click', () => {
		$giftsOverlay.classList.add('active');
	});

	$closeGiftsBtn.addEventListener('click', () => {
		$giftsOverlay.classList.remove('active');
	});

	$giftsOverlay.addEventListener('click', (ev) => {
		if (ev.target === $giftsOverlay) {
			$giftsOverlay.classList.remove('active');
		}
	});

	// page animations
	gsap.registerPlugin(CustomEase);
	const tl = gsap.timeline({ delay: 0.5 });
	if (
		window.matchMedia(
			'screen and (min-width: 992px) and (orientation: landscape)',
		).matches
	) {
		tl.fromTo(
			['.headline', '.title .heading-1', '.title .subtitle', '.cta-container'],
			{ opacity: 0, translateY: 100 },
			{ opacity: 1, translateY: 0, stagger: 0.1 },
		);
	} else {
		tl.fromTo(
			['.headline', '.title .heading-1', '.title .subtitle', '.cta-container'],
			{ opacity: 0, translateX: -100 },
			{ opacity: 1, translateX: 0, stagger: 0.1 },
		);
	}
	tl.fromTo(
		'.patch',
		{ scale: 0, rotate: 20 },
		{ scale: 1, rotate: 0, ease: 'back.out(2)' },
		'>0.5',
	);
	tl.add(() => {
		document.querySelector('.btn-to-game').classList.add('anim-pulse');
	}, '>1.5');
	tl.to(
		'.patch',
		{
			scale: 1.05,
			rotate: 10,
			ease: CustomEase.create(
				'custom',
				'M0,0 C0.2,-0.106 0.19,0.908 0.3,1 0.336,1.03 0.399,0.99 0.5,0.99 0.597,0.99 0.668,1.031 0.7,1 0.798,0.902 0.808,-0.114 1,0',
			),
			duration: 0.6,
			repeat: -1,
			repeatDelay: 3.4,
		},
		'>2',
	);
});
