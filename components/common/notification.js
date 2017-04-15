import { NotificationStack } from 'react-notification';

class Notification extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: [],
      count: 0
    };

    this.addNotification = this.addNotification.bind(this);
    this.handleDismissNotification = this.handleDismissNotification.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
    this.success = this.success.bind(this);
  }

  addNotification(message, barStyle) {
    const { notifications, count } = this.state;
    const newCount = count + 1;
    return this.setState({
      count: newCount,
      notifications: [
        ...notifications,
        {
          message,
          key: newCount,
          dismissAfter: 3500,
          barStyle: Object.assign(
            {
              color: 'white',
              fontFamily: 'inherit',
              fontSize: '16px',
              padding: '15px',
              fontWeight: 'bold',
              boxShadow: 'none'
            },
            barStyle
          ),
          onClick: () => this.removeNotification(newCount)
        }
      ]
    });
  }

  error(message) {
    this.addNotification(message, { backgroundColor: '#e74c3c' });
  }

  success(message) {
    this.addNotification(message, { backgroundColor: '#2ecc71' });
  }

  handleDismissNotification(notification) {
    return this.removeNotification(notification.key);
  }

  removeNotification(count) {
    const { notifications } = this.state;
    this.setState({
      notifications: notifications.filter(n => n.key !== count)
    });
  }

  render() {
    return (
      <div>
        <NotificationStack
          notifications={this.state.notifications}
          onDismiss={this.handleDismissNotification}
        />
      </div>
    );
  }
}

export default Notification;
