import classNames from 'classnames';
import Button from 'components/Button';
import Icon from 'components/Icon';
import IconType from 'components/Icon/IconType';
import { ReactComponent as SocialGoogleIcon } from '../../../data/icons/social-google.svg';
import { ReactComponent as SocialDiscordIcon } from '../../../data/icons/social-discord.svg';
import { ReactComponent as SocialTwitchIcon } from '../../../data/icons/social-twitch.svg';
import AuthenticationType from '../AuthenticationType';
import { useSocialLogins } from './useSocialLogins';

const LoginButton = ({ children, onClick, styles, disabled }) => (
  <Button
    onClick={onClick}
    className={classNames(styles.signInButton)}    
    disabled={disabled}
  >
    {children}
  </Button>
);

const SocialLogin = ({ styles, prepend = [], signUp = true, authenticationType, disabled }) => {
  const {
    initGoogleLogin,
    initFacebookLogin,
    initTwitchLogin,
    initDiscordLogin,
    isVisible
  } = useSocialLogins();

  const showNewFeatures =
    process.env.REACT_APP_SHOW_UPCOMING_FEATURES === 'true';
  const iconProps = {
    className: styles.buttonIcon,
  };

  const prefixText = authenticationType === AuthenticationType.register ? "Sign up" : "Login";

  return (
    <div className={classNames(styles.socialContainer, signUp && styles.verticalContainer)}>
      {prepend.map(({ content, onClick }) => (
        <LoginButton styles={styles} onClick={onClick} className={classNames(styles.loginButton, disabled && styles.disabled)}>
          {content}
        </LoginButton>
      ))}
      {isVisible.google && 
        signUp ? (
          <LoginButton styles={styles} onClick={!disabled ? initGoogleLogin : null} signUp={signUp} disabled={disabled}>
            <Icon className={styles.socialIcon} iconType={IconType.google} {...iconProps} />
            <p>Sign up with Google</p>
          </LoginButton>
          ) : (
            <SocialGoogleIcon className={styles.socialButton} onClick={initGoogleLogin}/>
          )
      }
      {isVisible.twitch && 
        signUp ? (
          <LoginButton styles={styles} onClick={!disabled ? initTwitchLogin : null} signUp={signUp} disabled={disabled}>
            <Icon className={styles.socialIcon} iconType={IconType.twitch} {...iconProps} />
            <p>Sign up with Twitch</p>
          </LoginButton>
        ) : (
          <SocialTwitchIcon className={styles.socialButton} onClick={initTwitchLogin}/>
        )
      }
      {isVisible.discord &&
        signUp ? (
          <LoginButton styles={styles} onClick={!disabled ? initDiscordLogin : null} signUp={signUp} disabled={disabled}>
            <Icon className={styles.socialIcon} iconType={IconType.discord} {...iconProps} />
            <p>Sign up with Discord</p>
          </LoginButton>
        ) : (
          <SocialDiscordIcon className={styles.socialButton} onClick={initDiscordLogin}/>
        )
      }
    </div>
  );
};

export default SocialLogin;
