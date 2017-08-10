import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Meteor from 'react-native-meteor';
import realm from '../lib/realm';
import RocketChat from '../lib/rocketchat';
import RoomItem from '../components/RoomItem';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'stretch',
		justifyContent: 'center'
	},
	separator: {
		height: 1,
		backgroundColor: '#E7E7E7'
	},
	list: {
		width: '100%'
	},
	emptyView: {
		flexGrow: 1,
		alignItems: 'stretch',
		justifyContent: 'center'
	},
	emptyText: {
		textAlign: 'center',
		fontSize: 18,
		color: '#ccc'
	},
	bannerContainer: {
		backgroundColor: '#ddd'
	},
	bannerText: {
		textAlign: 'center',
		margin: 5
	},
	actionButtonIcon: {
		fontSize: 20,
		height: 22,
		color: 'white'
	}
});

let navigation;

Meteor.getData().on('loggingIn', () => {
	setTimeout(() => {
		if (Meteor._isLoggingIn === false && Meteor.userId() == null) {
			console.log('loggingIn', Meteor.userId());
			navigation.navigate('Login');
		}
	}, 100);
});

Meteor.Accounts.onLogin(() => {
	console.log('onLogin');
});

export default class RoomsListView extends React.Component {
	static propTypes = {
		navigation: PropTypes.object.isRequired
	}

	static navigationOptions = () => {
		const server = RocketChat.currentServer ? RocketChat.currentServer.replace(/^https?:\/\//, '') : '';
		const textAlign = Platform.OS === 'ios' ? 'center' : 'left';
		const marginLeft = Platform.OS === 'ios' ? 0 : 20;
		return {
			headerTitle: <View style={{ height: 10, width: 200, top: -10, marginLeft }}>
				<Text style={{ textAlign, fontSize: 16, fontWeight: '600' }}>Channels</Text>
				<Text style={{ textAlign, fontSize: 10 }}>{server}</Text>
			</View>,
			title: 'Channels'
		};
	}

	constructor(props) {
		super(props);
		this._listViewOffset = 0;
		this.state = this.getState();
	}

	componentWillMount() {
		realm.addListener('change', this.updateState);

		navigation = this.props.navigation;

		if (RocketChat.currentServer) {
			RocketChat.connect();
		} else {
			navigation.navigate('ListServerModal');
		}
	}

	componentWillUnmount() {
		realm.removeListener('change', this.updateState);
	}

	getState = () => ({
		dataSource: realm.objects('subscriptions').filtered('_server.id = $0', RocketChat.currentServer).sorted('name').slice()
			.sort((a, b) => {
				if (a.unread < b.unread) {
					return 1;
				}

				if (a.unread > b.unread) {
					return -1;
				}

				return 0;
			})
	})

	updateState = () => {
		this.setState(this.getState());
	}

	_onPressItem = (id) => {
		const { navigate } = this.props.navigation;
		navigate('Room', { sid: id });
	}
	_createChannel = () => {
		const { navigate } = this.props.navigation;
		navigate('CreateChannel');
	}
	renderBanner = () => {
		const status = Meteor.getData() && Meteor.getData().ddp && Meteor.getData().ddp.status;

		if (status === 'disconnected') {
			return (
				<View style={[styles.bannerContainer, { backgroundColor: '#0d0' }]}>
					<Text style={[styles.bannerText, { color: '#fff' }]}>Connecting...</Text>
				</View>
			);
		}

		if (status === 'connected' && Meteor._isLoggingIn) {
			return (
				<View style={[styles.bannerContainer, { backgroundColor: 'orange' }]}>
					<Text style={[styles.bannerText, { color: '#a00' }]}>Authenticating...</Text>
				</View>
			);
		}
	}

	renderItem = ({ item }) => (
		<TouchableOpacity onPress={() => this._onPressItem(item._id)}>
			<RoomItem
				id={item._id}
				item={item}
			/>
		</TouchableOpacity>
	);

	renderSeparator = () => (
		<View style={styles.separator} />
	);

	renderList = () => {
		if (this.state.dataSource.length) {
			return (
				<FlatList
					style={styles.list}
					data={this.state.dataSource}
					renderItem={this.renderItem}
					keyExtractor={item => item._id}
					ItemSeparatorComponent={this.renderSeparator}
				/>
			);
		}

		return (
			<View style={styles.emptyView}>
				<Text style={styles.emptyText}>No rooms</Text>
			</View>
		);
	}
	renderCreateButtons() {
		return (
			<ActionButton buttonColor='rgba(231,76,60,1)'>
				<ActionButton.Item buttonColor='#9b59b6' title='Create Channel' onPress={() => { this._createChannel(); }} >
					<Icon name='md-chatbubbles' style={styles.actionButtonIcon} />
				</ActionButton.Item>
			</ActionButton>);
	}
	render() {
		return (
			<View style={styles.container}>
				{this.renderBanner()}
				{this.renderList()}
				{this.renderCreateButtons()}
			</View>
		);
	}
}
