import styles from './styles.module.scss';
import { connect } from 'react-redux';
import Button from '../Button';
import { PopupActions } from '../../store/actions/popup';
import { TOKEN_NAME } from '../../constants/Token';
import { useLocation } from 'react-router';
import CheckBox from '../CheckBox';
import { useState } from 'react';
import HighlightType from 'components/Highlight/HighlightType';

const DisclaimerPopupView = ({ closed, hidePopup }) => {
  const { pathname } = useLocation();

  const [agreedWithTerms, setAgreedWithTerms] = useState(false);

  const handleClickButton = () => {
    localStorage.setItem('acceptedTerms', 'true');
    hidePopup();
  };

  const renderDisclaimerText = () => {
    return (
      <div className={styles.disclaimerPopupTextContainer}>
        {/* 
          <h3 className={styles.disclaimerPopupTextHeadline}>
          
            <span className={styles.disclaimerPopupTextHeadlineUnderline}></span>
          </h3> 
        */}

        <span className={styles.disclaimerPopupText}>
          <p>
            Wallfair Alpha is a graphical user interface for visualizing data
            and interacting with a simulation of the upcoming social events
            betting platform.
          </p>
          <p>
            Wallfair does not take any custody, profits or host over any
            markets. Please read the disclaimer below before proceeding.
          </p>
        </span>

        <div className={styles.disclaimerPopupScrollableContainer}>
          <div className={styles.disclaimerPopupScrollableText}>
            <p>
              Wallfair.io serves informational, entertainment and educational
              purposes only. We neither plan to take custody of any user's or
              participant's fiat or cryptocurrency assets nor to host any events
              that have not been prepared by or agreed with the team of
              Wallfair. The users need to be of age (18+) and sound body and
              mind (meaning unaffected by addiction or substances causing loss
              of control or consciousness) to use the website. The participation
              in the events and trades on the website is voluntary and final and
              the availability of the platform may be affected by the online
              connection enabled by your local internet provider.
            </p>

            <p>
              Wallfair Ltd. is a company organized in accordance with the laws
              of Bailwick of Guernsey (Alderney), registration number 2024,
              located at 2 Victoria Street, St. Anne, GY9 3UF, Alderney Channel
              Islands.
            </p>

            <p>
              Wallfair Ltd. has pending applications for gambling licenses with
              the Alderney Gambling Control Commission and the Curacao Gaming
              Authority. Curacao Gaming licensing and supervision is controlled
              by the Government of Curacao under National Decree No. 14 from 18.
              August 1998 while the applicable law on Alderney is the Gambling
              Law of 1999. Under these licensing ordinances, the license
              applicant/holder is authorized to advertise and provide services
              in such countries and territories that have issued own gambling
              regulations or have been blacklisted by the regulatory
              authorities. Wallfair Ltd. is closely observing the applicability
              of the licensing regulations and taking all measures with the
              purpose to comply with the applicable legal requirements. All
              further questions and doubts can be addressed to the team at
              hello@wallfair.io.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderCheckbox = () => {
    return (
      <CheckBox
        className={styles.authenticationLegalAuthorizationAgreementCheckBox}
        checked={agreedWithTerms}
        setChecked={setAgreedWithTerms}
        clickable={false}
        text={
          <span>
            I Agree with the{' '}
            <a
              href="https://files.wallfair.io/wallfair_t_and_c.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Terms &amp; Conditions
            </a>{' '}
            and I'm aware of the Disclosure
          </span>
        }
      />
    );
  };

  const renderCTAButton = () => {
    return (
      <Button
        onClick={handleClickButton}
        withoutBackground={true}
        highlightType={HighlightType.highlightAuthButton}
        className={styles.ctaButton}
        disabled={!agreedWithTerms}
        disabledWithOverlay={true}
      >
        <span>Proceed</span>
      </Button>
    );
  };

  return (
    <div className={styles.disclaimerPopupContainer}>
      {renderDisclaimerText()}
      {renderCheckbox()}
      {renderCTAButton()}
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    hidePopup: () => {
      dispatch(PopupActions.hide());
    },
  };
};

export default connect(null, mapDispatchToProps)(DisclaimerPopupView);
