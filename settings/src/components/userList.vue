<template>
	<div id="app-content" class="user-list-grid">
		<div class="row" id="grid-header">
			<div id="headerAvatar"></div>
			<div id="headerName">{{ t('settings', 'Username') }}</div>
			<div id="headerDisplayName">{{ t('settings',  'Full name') }}</div>
			<div id="headerPassword">{{ t('settings',  'Password') }}</div>
			<div id="headerAddress">{{ t('settings',  'Email') }}</div>
			<div id="headerGroups">{{ t('settings',  'Groups') }}</div>
			<div id="headerSubAdmins" v-if="subAdminsGroups.length>0">{{ t('settings', 'Group admin for') }}</div>
			<div id="recoveryPassword" v-if="settings.recoveryAdminEnabled">{{ t('settings', 'Recovery password') }}</div>
			<div id="headerQuota">{{ t('settings', 'Quota') }}</div>
			<div class="headerStorageLocation">{{ t('settings', 'Storage location') }}</div>
			<div class="headerUserBackend">{{ t('settings', 'User backend') }}</div>
			<div class="headerLastLogin">{{ t('settings', 'Last login') }}</div>
		</div>

		<form class="row" id="new-user">
		</form>

		<user-row v-for="(user, key) in users" :user="user" :key="key" :settings="settings"/>
	</div>
</template>

<script>
import userRow from './userList/userRow'

export default {
	name: 'userList',
	props: ['users'],
	components: { userRow },
	computed: {
		settings() {
			return this.$store.getters.getServerData;
		},
		subAdminsGroups() {
			// Data provided php side
			return this.$store.getters.getServerData.subadmingroups;
		}
	},
}
</script>
