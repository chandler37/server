import api from './api';

const state = {
	users: [],
	groups: [],
	loading: false
};

const mutations = {
	setUsers(state, users) {
		state.users = users;
	},
	initGroups(state, groups) {
		state.groups = groups;
	},
	createGroup(state, groupid) {
		try {
			state.groups.push({
				id: groupid,
				name: groupid,
				usercount: 0 // user will be added after the creation
			});
		} catch (e) {
			console.log('Can\'t create group', e);
		}
	},
	setUserGroups(state, {name, groups}) {
		try {
			let oldGroups = state.users.find(user => user.name == name).groups;
			// intersect the removed groups for the user
			let delGroups = oldGroups.filter(x => !groups.includes(x));
			// intersect the new groups for the user
			let addGroups = groups.filter(x => !oldGroups.includes(x));
			// change local data
			state.users.find(user => user.name == name).groups = groups;
			if(delGroups.length > 0) {
				delGroups.forEach((gid) => {
					// this should not be needed as it would means the user contains a group
					// the server database doesn't have.
					let group = state.groups.find(groupSearch => groupSearch.id == gid)
					if (group) {
						group.usercount--;	// lower count
					}
				})
			}
			if(addGroups.length > 0) {
				addGroups.forEach((gid) => {
					// this should not be needed as it would means the user contains a group
					// the server database doesn't have.
					let group = state.groups.find(groupSearch => groupSearch.id == gid)
					if (group) {
						group.usercount++;	// increase count
					}
				})
			}
		} catch (e) {
			console.log('Can\'t set user groups', e);
		}
	},
	setUserQuota(state, {name, quota}) {
		state.users.find(user => user.name == name).quota = quota.id;
	},
	setUserSubAdminsGroups(state, {name, groups}) {
		state.users.find(user => user.name == name).subadmin = groups;
	}
};

const getters = {
	getUsers(state) {
		return state.users;
	},
	getGroups(state) {
		return state.groups;
	}
};

const actions = {
	getUsers(context) {
		return api.get(OC.generateUrl('/settings/users/users?offset=0&limit=25'))
			.then((response) => context.commit('setUsers', response.data ))
			.catch((error) => context.commit('API_FAILURE', error));
	},
	setUserQuota(context, {name, quota}) {
		return api.post(OC.generateUrl('/settings/ajax/setquota.php'), {username: name, quota: quota})
			.then((response) => context.commit('setUserQuota', {name, quota} ))
			.catch((error) => context.commit('API_FAILURE', error))
	}
};

export default {state, mutations, getters, actions};
