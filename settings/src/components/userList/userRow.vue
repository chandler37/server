<template>
	<div class="row">
		<div class="avatar"><img alt="" width="32" height="32" :src="generateAvatar(user.name, 32)" :srcset="generateAvatar(user.name, 64)+' 2x, '+generateAvatar(user.name, 128)+' 4x'"></div>
		<div class="name">{{user.name}}</div>
		<div class="displayName">
			<input :id="'displayName'+user.name+rand" type="text" :value="user.displayName"
					autocomplete="new-password" autocorrect="off" autocapitalize="off" spellcheck="false" />
			<label :for="'displayName'+user.name+rand" class="icon-rename" :title="t('settings', 'Change display name')"></label>
		</div>
		<div class="password">
			<input :id="'password'+user.name+rand" type="password" placeholder="●●●●●●●●●●" value=""
					autocomplete="new-password" autocorrect="off" autocapitalize="off" spellcheck="false" />
			<label :for="'password'+user.name+rand" class="icon-rename" :title="t('settings', 'Change password')"></label>
		</div>
		<div class="mailAddress">
			<input :id="'mailAddress'+user.name+rand" type="text" :value="user.email"
					autocomplete="new-password" autocorrect="off" autocapitalize="off" spellcheck="false" />
			<label :for="'mailAddress'+user.name+rand" class="icon-rename" :title="t('settings', 'Change email address')"></label>
		</div>
		<div class="groups">
			<v-select :options="groups" :placeholder="t('settings', 'Add user to group')"
 					   label="name" :closeOnSelect="false" ref="groupsSelect"
 					   :on-change="setUserGroups" :createOption="createGroup" multiple taggable push-tags>
				<template slot="option" slot-scope="option">
					<!-- dirty hack, if no id key, we know we're creating a new group -->
					<span class="icon-add" v-if="!option.id"></span>
					{{ option.name }}
				</template>
			</v-select>
		</div>
		<div class="subadmins" v-if="subAdminsGroups.length>0">
			<v-select :options="subAdminsGroups" :placeholder="t('settings', 'Set user as admin for')"
 					   label="name" :closeOnSelect="false" ref="subAdminsGroupsSelect"
 					   :on-change="setUserSubAdminsGroups" multiple taggable>
			</v-select>
		</div>
		<div v-if="settings.recoveryAdminEnabled" ></div>
		<div class="quota">
			<v-select :options="quotaOptions" :value="user.quota" :placeholder="t('settings', 'Select user quota')"
					:closeOnSelect="false"
					@input="setUserQuota" push-tags>
			</v-select>
			<progress class="quota-user-progress" value="" max="100"></progress>
		</div>
		<div class="storageLocation"></div>
		<div class="userBackend"></div>
		<div class="lastLogin"></div>
		<div class="userActions">
			<div class="toggleUserActions">
				<a class="action"><span class="icon-more"></span></a>
				<div class="popovermenu">
					<ul class="userActionsMenu">
						<li>
							<a href="#" class="menuitem action-togglestate permanent" data-action="togglestate"></a>
						</li>
						<li>
							<a href="#" class="menuitem action-remove permanent" data-action="remove">
								<span class="icon icon-delete"></span>
								<span>Delete</span>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		</div>
</template>

<script>
import vSelect from 'vue-select';

export default {
	name: 'userRow',
	props: ['user', 'settings'],
	components: { vSelect },
	mounted() {
		// Match the default string values to the group objects
		let selectedGroups = this.groups.filter(group => this.user.groups.includes(group.id));
		this.$refs.groupsSelect.mutableValue = selectedGroups;
		let selectedSubAdminsGroups = this.groups.filter(group => this.user.subadmin.includes(group.id));
		this.$refs.subAdminsGroupsSelect.mutableValue = selectedSubAdminsGroups;
	},
	data() {
		return {
			rand: parseInt(Math.random() * 1000)
		}
	},
	computed: {
		subAdminsGroups() {
			// data provided php side
			return this.$store.getters.getServerData.subadmingroups;
		},
		groups() {
			// data provided php side + remove the disabled group
			return this.$store.getters.getGroups.filter(group => group.id !== '_disabledUsers');
		},
		quotaOptions() {
			// convert the preset array into objects
			let quotaPreset = this.settings.quotaPreset.reduce((acc, cur) => acc.concat({id:cur, label:cur}), []);
			// add default presets
			quotaPreset.unshift({id:'default', label:t('settings', 'Default quota')});
			quotaPreset.unshift({id:'none', label:t('settings', 'Unlimited')});
			return quotaPreset;
		}
	},
	methods: {
		generateAvatar(user, size) {
			return OC.generateUrl(
				'/avatar/{user}/{size}?v={version}',
				{
					user: user,
					size: size,
					version: oc_userconfig.avatar.version
				}
			);
		},
		createGroup(gid) {
			this.$store.commit('createGroup', gid);
			return this.$store.getters.getGroups[this.groups.length];
		},
		setUserGroups(groups) {
			if (Array.isArray(groups) && groups.length > 0) {
				groups = groups.map(group => group.id); // convert objects into array
				let name = this.user.name;
				return this.$store.commit('setUserGroups', {name, groups});
			}
			return false;
		},
		setUserSubAdminsGroups(groups) {
			if (Array.isArray(groups) && groups.length > 0) {
				groups = groups.map(group => group.id); // convert objects into array
				let name = this.user.name;
				return this.$store.commit('setUserSubAdminsGroups', {name, groups});
			}
			return false;
		},
		setUserQuota(quota) {
			let name = this.user.name;
			this.$store.dispatch('setUserQuota', {name, quota});
			return quota;
		},
		formatOptionsForDisplay(selected) {
			return selected.map(obj => obj.option.name).join(', ');
		}
	}
}
</script>
