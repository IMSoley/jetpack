function rewindFixture( rewindStatus ) {
	return {
		data: {
			status: rewindStatus,
		},
	};
}

function siteDataFixture( { productSlug } ) {
	return {
		requests: {
			isFetchingSiteDiscount: false,
		},
		data: {
			plan: {
				product_slug: productSlug,
			},
		},
	};
}

function introOffersFixture() {
	return {
		requests: {
			isFetching: false
		},
		data: [ {
			product_id:2016,
			product_slug: "jetpack_security_t1_yearly",
			currency_code: "USD",
			formatted_price: "US$107.40",
			original_price: 299.4,
			raw_price: 107.4,
			discount_percentage: 64,
			ineligible_reason: null,
		}, {
			product_id: 2112,
			product_slug: "jetpack_backup_t1_yearly",
			currency_code: "USD",
			formatted_price: "US$47.40",
			original_price:119.4,
			raw_price: 47.4,
			discount_percentage: 60,
			ineligible_reason: null,
		}]
	}
}

function upsellFixture( { hideUpsell } ) {
	return {
		product_id: 2101,
		product_slug: 'jetpack_backup_t1_monthly',
		billing_timeframe: 'billed monthly',
		cost_timeframe: 'per month',
		cta_text: 'Learn more',
		currency_code: 'USD',
		description:
			'Never lose a word, image, page, or time worrying about your site with automated off-site backups and one-click restores.',
		features: [
			'Automated daily off-site backups',
			'One-click restores',
			'Unlimited secure storage',
		],
		header: 'Recommended premium product',
		hide_upsell: hideUpsell,
		price: 9.95,
		title: 'Backup Daily',
	};
}

/**
 * Build an object that can be use as a Redux store initial state.
 *
 * @param {object} options
 * @param {boolean} options.hideUpsell – whether to show the upsell product card
 * @param {string} options.productSlug – product slug of the site's plan
 * @param {object} options.rewindStatus – rewind status of the site
 * @returns {object} – initial Redux state
 */
export function buildInitialState( {
	enabledRecommendations = {},
	hideUpsell = false,
	productSlug,
	rewindStatus = { state: 'unavailable' },
} = {} ) {
	return {
		jetpack: {
			initialState: {
				userData: {
					currentUser: 100,
				},
			},
			connection: {
				status: {
					siteConnected: {
						hasConnectedOwner: true,
					},
				},
				user: {
					currentUser: {
						isConnected: true,
					},
				},
			},
			pluginsData: {
				items: {
					'jetpack/jetpack.php': {
						active: true,
					},
				},
			},
			recommendations: {
				upsell: upsellFixture( { hideUpsell } ),
				requests: {},
				data: {},
			},
			rewind: rewindFixture( rewindStatus ),
			settings: {
				items: enabledRecommendations,
			},
			siteData: siteDataFixture( { productSlug } ),
			introOffers: introOffersFixture()
		},
	};
}
