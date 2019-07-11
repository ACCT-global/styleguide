import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import ExternalLink from '../icon/ExternalLink'

class Link extends PureComponent {
  render() {
    const { children, href, target, mediumWeigth } = this.props
    let classes =
      'pointer c-link hover-c-link active-c-link no-underline underline-hover  '
    classes += mediumWeigth ? 'fw5' : ''
    const isExternal = target === '_blank'

    return (
      <a href={href} target={target} className={classes}>
        {children}
        {isExternal && (
          <span className="ml2">
            <ExternalLink size={12} />
          </span>
        )}
      </a>
    )
  }
}

Link.defaultProps = {
  target: '_self',
  mediumWeigth: false,
}

Link.propTypes = {
  /** Content of the link */
  children: PropTypes.string.isRequired,
  /** Spec attribute */
  href: PropTypes.string.isRequired,
  /** Spec attribute */
  target: PropTypes.oneOf(['_self', '_blank', '_parent', '_top']),
  /** Weight property */
  mediumWeigth: PropTypes.bool,
}

export default Link