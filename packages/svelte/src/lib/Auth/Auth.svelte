<script lang="ts">
	import { createStitches, createTheme } from '@stitches/core';
	import type { SupabaseClient, Provider } from '@supabase/supabase-js';
	import {
		type I18nVariables,
		merge,
		VIEWS,
		en,
		type SocialLayout,
		type ViewType
	} from '@supabase/auth-ui-shared';
	import type { Appearance } from '$lib/types';
	import EmailAuth from './interfaces/EmailAuth.svelte';
	import ForgottenPassword from './interfaces/ForgottenPassword.svelte';
	import MagicLink from './interfaces/MagicLink.svelte';
	import SocialAuth from './interfaces/SocialAuth.svelte';
	import UpdatePassword from './interfaces/UpdatePassword.svelte';
	import { onMount } from 'svelte';

	export let supabaseClient: SupabaseClient;
	export let socialLayout: SocialLayout = 'vertical';
	export let providers: Provider[] = [];
	export let view: ViewType = 'sign_in';
	export let redirectTo: string | undefined = undefined;
	export let onlyThirdPartyProviders = false;
	export let magicLink = false;
	export let showLinks = true;
	export let appearance: Appearance = {};
	export let theme: 'default' | string = 'default';
	export let localization: { variables?: I18nVariables } = {};

	onMount(() => {
		const { data: authListener } = supabaseClient.auth.onAuthStateChange((event) => {
			if (event === 'PASSWORD_RECOVERY') {
				view = 'update_password';
			} else if (event === 'USER_UPDATED') {
				view = 'sign_in';
			}
		});

		() => authListener.subscription.unsubscribe();
	});

	$: i18n = merge(en, localization.variables ?? {});

	$: createStitches({
		theme: merge(appearance?.theme?.default ?? {}, appearance?.variables?.default ?? {})
	});

	$: themeVariables = createTheme(
		merge(
			// @ts-ignore
			appearance?.theme?.[theme],
			appearance?.variables?.[theme] ?? {}
		)
	);
</script>

<div class={theme !== 'default' ? themeVariables : ''}>
	{#if view === VIEWS.SIGN_IN}
		<SocialAuth
			{appearance}
			{supabaseClient}
			{providers}
			{socialLayout}
			{redirectTo}
			{onlyThirdPartyProviders}
			{i18n}
		/>

		{#if !onlyThirdPartyProviders}
			<EmailAuth
				{appearance}
				{supabaseClient}
				bind:authView={view}
				{redirectTo}
				{magicLink}
				{showLinks}
				{i18n}
			/>
		{/if}
	{/if}
	{#if view === VIEWS.SIGN_UP}
		<SocialAuth
			{appearance}
			{supabaseClient}
			{providers}
			{socialLayout}
			{redirectTo}
			{onlyThirdPartyProviders}
			{i18n}
		/>

		{#if !onlyThirdPartyProviders}
			<EmailAuth
				{appearance}
				{supabaseClient}
				bind:authView={view}
				{redirectTo}
				{magicLink}
				{showLinks}
				{i18n}
			/>
		{/if}
	{/if}
	{#if view === VIEWS.FORGOTTEN_PASSWORD}
		<ForgottenPassword {i18n} {supabaseClient} bind:authView={view} {showLinks} {appearance} />
	{/if}
	{#if view === VIEWS.MAGIC_LINK}
		<MagicLink {i18n} {supabaseClient} bind:authView={view} {appearance} {redirectTo} {showLinks} />
	{/if}
	{#if view === VIEWS.UPDATE_PASSWORD}
		<UpdatePassword {i18n} {supabaseClient} bind:authView={view} {appearance} {showLinks} />
	{/if}
</div>
