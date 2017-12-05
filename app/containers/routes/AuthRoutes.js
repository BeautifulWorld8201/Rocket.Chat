import React from 'react';
import { Platform } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import Sidebar from '../../containers/Sidebar';
import DrawerMenuButton from '../../presentation/DrawerMenuButton';
import Header from '../../containers/Header';

import RoomsListView from '../../views/RoomsListView';
import RoomView from '../../views/RoomView';
import CreateChannelView from '../../views/CreateChannelView';
import SelectUsersView from '../../views/SelectUsersView';

const drawerPosition = 'left';
const drawerIconPosition = 'headerLeft';

const AuthRoutes = StackNavigator(
	{
		RoomsList: {
			screen: RoomsListView,
			navigationOptions({ navigation }) {
				return {
					title: 'Rooms',
					header: <Header navigation={navigation} />
				};
			}
		},
		Room: {
			screen: RoomView,
			navigationOptions({ navigation }) {
				return {
					title: navigation.state.params.name || navigation.state.params.room.name || 'Room'
					// [drawerIconPosition]: (<DrawerMenuButton navigation={navigation} />)÷
				};
			}
		},
		CreateChannel: {
			screen: CreateChannelView,
			navigationOptions: {
				title: 'Create Channel'
			}
		},
		SelectUsers: {
			screen: SelectUsersView,
			navigationOptions: {
				title: 'Select Users'
			}
		}
	},
	{}
);

const Routes = DrawerNavigator(
	{
		Home: {
			screen: AuthRoutes,
			navigationOptions({ navigation }) {
				return {
					title: 'Rooms',
					[drawerIconPosition]: <DrawerMenuButton navigation={navigation} />
				};
			}
		}
	},
	{
		contentComponent: Sidebar,
		drawerPosition,
		navigationOptions: {
			drawerLockMode: Platform.OS === 'ios' ? 'locked-closed' : 'unlocked'
		}
	}
);

export default Routes;
