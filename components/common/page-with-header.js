import { getPlayerInStorage } from '../../lib/players';
import { signOut } from '../../lib/user';
import Page from '../../document/page';
import Header from './header';

class PageWithHeader extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { player: {} };
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    this.setState({ player: getPlayerInStorage() });
  }

  handleLogout() {
    signOut();
  }

  render() {
    const { children, title } = this.props;
    const { player } = this.state;
    return (
      <Page>
        <Header
          player={player}
          title={title}
          onClickLogout={this.handleLogout}
          />
        {children}
      </Page>
    );
  }
}

PageWithHeader.propTypes = {
  children: React.PropTypes.node.isRequired,
  title: React.PropTypes.object
};

PageWithHeader.defaultProps = {
  title: <div/>
};

export default PageWithHeader;
