<script lang="ts">
	import { requestSpeedScoresHistory } from '@automattic/jetpack-boost-score-api';
	import { __ } from '@wordpress/i18n';
	import ErrorNotice from '../../../elements/ErrorNotice.svelte';
	import ReactComponent from '../../../elements/ReactComponent.svelte';
	import { PerformanceHistory } from '../../../react-components/PerformanceHistory';
	import { performanceHistoryPanelDS } from '../../../stores/data-sync-client';
	import { modulesState } from '../../../stores/modules';
	import { recordBoostEvent } from '../../../utils/analytics';
	import { castToString } from '../../../utils/cast-to-string';
	import routerHistory from '../../../utils/router-history';

	const siteIsOnline = Jetpack_Boost.site.online;

	let loadError;
	let isLoading = false;
	let periods = [];
	let startDate;
	let endDate;

	// Load the history
	refresh();

	/**
	 * Load the speed history from the API
	 *
	 */
	export async function refresh() {
		// Don't run in offline mode.
		if ( ! siteIsOnline ) {
			return;
		}

		isLoading = true;
		loadError = undefined;

		try {
			const response = await requestSpeedScoresHistory(
				wpApiSettings.root,
				Jetpack_Boost.site.url,
				wpApiSettings.nonce
			);
			periods = response.data.periods;
			startDate = response.data._meta.start;
			endDate = response.data._meta.end;
		} catch ( err ) {
			recordBoostEvent( 'speed_history_request_error', {
				error_message: castToString( err.message ),
			} );
			// eslint-disable-next-line no-console
			loadError = err;
		} finally {
			isLoading = false;
		}
	}

	const panelStore = performanceHistoryPanelDS.store;
	const onToggleHistory = status => {
		panelStore.set( status );
	};

	$: needsUpgrade = $modulesState.performance_history.available === false;
</script>

<div class="jb-performance-history" class:loading={isLoading}>
	{#if loadError}
		<ErrorNotice
			title={__( 'Failed to load performance history', 'jetpack-boost' )}
			error={loadError}
			suggestion={__( '<action name="retry">Try again</action>', 'jetpack-boost' )}
			on:retry={() => refresh()}
		/>
	{/if}
	<ReactComponent
		this={PerformanceHistory}
		onToggle={onToggleHistory}
		isOpen={$panelStore}
		{needsUpgrade}
		handleUpgrade={() => routerHistory.navigate( '/upgrade' )}
		{periods}
		{startDate}
		{endDate}
	/>
</div>
