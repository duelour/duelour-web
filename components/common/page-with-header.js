import { getPlayerInStorage } from '../../lib/data/players';
import { signOut } from '../../lib/data/user';
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
    const { children, goBackPath, title } = this.props;
    const { player } = this.state;
    return (
      <Page>
        <Header
          player={player}
          title={title}
          goBackPath={goBackPath}
          onClickLogout={this.handleLogout}
        />
        {children}
      </Page>
    );
  }
}

PageWithHeader.propTypes = {
  children: React.PropTypes.node.isRequired,
  goBackPath: React.PropTypes.string,
  title: React.PropTypes.object
};

PageWithHeader.defaultProps = {
  goBackPath: null,
  title: <div />
};

export default PageWithHeader;
