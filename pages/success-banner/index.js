import React, { Component } from 'react';
import Head from 'next/head';
import { Tracker } from '../_Providers';
import Image from '../../components/Image';
import locals from '../../config/cache.json';
import compareVersions from 'compare-versions';

import { tagManagerHead, tagManagerNoScript } from '../../lib/scripts';

const CAMPAIGN_URL =
  'https://etcher.io/pro?utm_source=etcher_app&utm_campaign=etcher_pro';
/**
 * @summary Make and return an event method for a given event description string
 * @function
 * @private
 *
 * @param {String} eventDesc - event description
 *
 * @example
 * eventLog('click Tweet button');
 * > 'Banner click Tweet button'
 */
const eventLog = eventDesc => {
  const data = 'Banner ' + eventDesc;

  return () => {
    const url = new URL(location.href);

    // Use the 'new' API version for more recent versions of Etcher utilizing
    // the Robot object format.
    if (url.searchParams.get('api-version') === '1') {
      console.log(
        JSON.stringify({
          command: 'log',
          data
        })
      );

      // Fallback to the old pure-string format.
    } else {
      console.log(data);
    }
  };
};

/**
 * @summary Display Etcher version on mount
 * @class
 * @private
 *
 * @example
 * <EtcherVersion />
 */
class EtcherVersion extends React.PureComponent {
  constructor() {
    super();

    this.state = { version: '' };
  }

  render() {
    return (
      <span className="version">
        {this.state.version}
      </span>
    );
  }

  componentDidMount() {
    const version = new URL(location.href).searchParams.get('etcher-version');
    this.setState({ version });
  }
}

/**
 * @summary Pure text links
 * @class
 * @private
 *
 * @example
 * <Link label="Example" href="https://example.com/">Example page</Link>
 */
class Link extends React.PureComponent {
  constructor() {
    super();

    this.type = 'link';
  }

  render() {
    return (
      <a
        href={this.props.href}
        target="_blank"
        rel="noopener noreferrer"
        className={this.type}
        onClick={() => {
          this.context.track(
            `etcher_app ${this.props.label} button`,
            this.props.meta
          );
          eventLog(`click ${this.props.label} ${this.type}`);
        }}
      >
        {this.props.children}
      </a>
    );
  }
}

// Get tracker details
Link.contextTypes = {
  track: React.PropTypes.func
};

/**
 * @summary Button links
 * @class
 * @private
 *
 * @example
 * <Button label="Submit" href="/submit/">Submit something</Button>
 */
class Button extends Link {
  constructor(props) {
    super();

    this.type = 'button ' + props.className;
  }
}

/**
   * @summary Etcher Pro Banner variant A
   * @function
   * @private
   *
   * @example
   * <BannerEtcherProA />
   */

const BannerEtcherProA = () =>
  <main className="vertical center variantA">
    <div>
      <h1 className="variantA">Ever wanted a duplicator as slick as Etcher?</h1>
    </div>
    <div className="horizontal center grow">
      <div className="vertical center">
        <Button
          className="variantA"
          label="successBanner pro"
          href={`${CAMPAIGN_URL}&utm_medium=vna`}
          meta={{
            vn: 'a'
          }}
        >
          Discover
          <Image className="icon" src="pro/logo-banner.svg" retina={false} />
        </Button>
      </div>
      <div className="vertical center">
        <Image className="product-img" src="pro/outline.png" />
      </div>
    </div>
    <Footer />
  </main>;

/**
     * @summary Etcher Pro Banner variant B
     * @function
     * @private
     *
     * @example
     * <BannerEtcherProB />
     */

class BannerEtcherProB extends React.PureComponent {
  constructor() {
    super();

    this.state = { legacy: false };
  }

  render() {
    const className = `vertical center ${this.state.legacy
      ? 'legacy-background-color'
      : 'new-background-color'}`;
    return (
      <main className={className}>
        <div className="horizontal center grow">
          <div>
            <Image className="product-img" src="pro/outline.png" />
          </div>
          <div className="ml-2 vertical center">
            <h1>
              Introducing
              <Image
                className="icon etcherPro"
                src="pro/logo-banner.svg"
                retina={false}
              />
            </h1>
            <Button
              label="successBanner pro"
              meta={{
                vn: 'b'
              }}
              href={`${CAMPAIGN_URL}&utm_medium=vnb`}
            >
              Discover More
            </Button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  componentDidMount() {
    const version = new URL(location.href).searchParams.get('etcher-version');
    if (version) {
      const legacy = compareVersions(version, '1.4.4') < 1;
      this.setState({ legacy });
    } else {
      this.setState({ legacy: true });
    }
  }
}

/**
 * @summary Footer
 * @function
 * @private
 *
 * @example
 * <Footer />
 */
const Footer = () =>
  <footer>
    made with
    <img className="icon" src="/static/love.svg" />
    by
    <Link href="https://resin.io/" label="Resin">
      <img className="brand" src="/static/resin.png" />
    </Link>
    <Link
      href="https://github.com/resin-io/etcher/blob/master/CHANGELOG.md"
      label="Version"
    >
      <EtcherVersion />
    </Link>
  </footer>;

/**
 * @summary Page
 * @function
 * @public
 *
 * @example
 * <Page />
 */
class Page extends Component {
  constructor() {
    super();
    this.state = {
      vn: 'b'
    };
  }

  render() {
    return (
      <Tracker analytics={locals.analytics}>
        <div>
          <Head>
            <script
              dangerouslySetInnerHTML={{
                __html: tagManagerHead(locals.analytics.tagManagerId)
              }}
            />
            <meta charSet="utf-8" />
            <link
              rel="stylesheet"
              type="text/css"
              href="/static/success-banner.css?v=1.0.1"
            />
          </Head>
          <noscript
            dangerouslySetInnerHTML={{
              __html: tagManagerNoScript(locals.analytics.tagManagerId)
            }}
          />
          {this.state.vn === 'b' ? <BannerEtcherProB /> : <BannerEtcherProA />}
        </div>
      </Tracker>
    );
  }
}
export default Page;
