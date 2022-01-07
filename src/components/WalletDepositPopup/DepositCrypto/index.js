
import { useCallback, useEffect, useState } from 'react';

import styles from './styles.module.scss';
import {ReactComponent as BitcoinIcon} from '../../../data/icons/deposit/bitcoin.svg';
import {ReactComponent as EuroIcon} from '../../../data/icons/deposit/euro.svg';
import {ReactComponent as WalletIcon} from '../../../data/icons/deposit/wallet.svg';
import {ReactComponent as Arrow} from '../../../data/icons/deposit/arrow.svg';
import Button from 'components/Button';
import {convertCurrency, generateCryptopayChannel, sendBuyWithCrypto} from '../../../api/index';
import { numberWithCommas } from 'utils/common';
import useDebounce from 'hooks/useDebounce';
import Dropdown from 'components/Dropdown';
import {ReactComponent as LeftArrow} from '../../../data/icons/deposit/left-arrow.svg';
import { PopupActions } from 'store/actions/popup';
import PopupTheme from 'components/Popup/PopupTheme';
import { connect } from 'react-redux';
import { TOKEN_NAME } from 'constants/Token';
import NumberCommaInput from 'components/NumberCommaInput/NumberCommaInput';
import ReferralLinkCopyInputBox from 'components/ReferralLinkCopyInputBox';
import InputBoxTheme from 'components/InputBox/InputBoxTheme';
import QRCode from 'react-qr-code';
import classNames from 'classnames';

const cryptoShortName = {
  BITCOIN: 'BTC',
  ETHEREUM: `ETH`,
  LITECOIN: `LTC`,
};

const CURRENCY_OPTIONS = [
  {
    label: 'BITCOIN',
    value: 0,
  },
  {
    label: 'ETHEREUM',
    value: 1,
  },
  {
    label: 'LITECOIN',
    value: 2,
  },
];

const DepositCrypto = ({user, showWalletDepositPopup}) => {

  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCY_OPTIONS[0]);
  const [inputAmount, setInputAmount] = useState(0.1);
  const [tokenValue, setTokenValue] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [address, setAddress] = useState('');
  const [uri, setUri] = useState('');
  const [errorFetchingChannel, setErrorFetchingChannel] = useState(false);

  const selectContent = event => {
    event.target.select();
  }

  useEffect(() => {
    onInputAmountChange(inputAmount);
    fetchReceiverAddress(selectedCurrency.label);
  }, [selectedCurrency.label, inputAmount]);

  const fetchReceiverAddress = useCallback(async (tab) => {
    const currencyName = cryptoShortName[tab];
    const channel = await generateCryptopayChannel({ currency: currencyName });
    
    if(channel.error) {
      return setErrorFetchingChannel(true);
    }

    setErrorFetchingChannel(false);
    setAddress(channel.address);
    setUri(channel.uri);
  }, [selectedCurrency.label]);

  const onInputAmountChange = useCallback(async (value) => {
    setInputAmount(value);
    if (value > 0) {
      const convertCurrencyPayload = {
        convertFrom: cryptoShortName[selectedCurrency.label],
        convertTo: 'WFAIR',
        amount: value,
      };

      const { response } = await convertCurrency(convertCurrencyPayload);
      const { convertedAmount } = response?.data;
      const convertedTokenValue = !convertedAmount
        ? 0
        : convertedAmount.toFixed(4);

      const roundedAmount = Math.floor(Number(convertedTokenValue) * 100) / 100;
      let WfairTokenValue = !roundedAmount
        ? 0
        : roundedAmount;

      setTokenValue(WfairTokenValue);
      setBonus(Math.min(100000, WfairTokenValue));
    } else {
      setTokenValue(0);
      setBonus(0);
    }
  }, [selectedCurrency.label]);

  const onChangeAmount = useDebounce({
    callback: onInputAmountChange,
    delay: 500,
  });

  const onCurrencyChange = val => {
    setSelectedCurrency(CURRENCY_OPTIONS.find(c => c.value === val));
  };

  const renderBackButton = () => {
    return (
      <div className={styles.chooseOtherMethod} onClick={showWalletDepositPopup}>
        <LeftArrow />
        <span>Other payment methods</span>
      </div>
    )
  }

  return (
    <div className={styles.depositCrypto}>
      {/* <p className={styles.title}>

        WFAIR conversion calculator
      </p>
      <p>
        Alpacasino uses WFAIR currency to play games and win. You can convert your won WFAIR token back into crypto currency  or in EUR / USD at any time around the world.
      </p> */}

      {renderBackButton()}

      <p className={styles.title}>
        Deposit with Crypto
      </p>
      <p>
        Deposit BTC, ETH or LTC and start playing immediately.
      </p>

      {/* Currency */}
      <div className={styles.formGroupContainer}>
        <span>Choose your currency</span>
        <div className={styles.inputContainer}>
          <Dropdown
            style={styles.dropdown}
            value={selectedCurrency.label}
            placeholder="Select currency..."
            setValue={onCurrencyChange}
            options={CURRENCY_OPTIONS}
          />
        </div>
      </div>

      
      {!errorFetchingChannel && (
        <div className={styles.transferInformation}>
          <div className={styles.qrCodeImg}>
            {uri && <QRCode value={uri} size={125} />}
          </div>
          <p>Send any amount of {cryptoShortName[selectedCurrency.label]} to the following address<sup>*</sup></p>
          <div className={styles.addressCopy}>
            <ReferralLinkCopyInputBox
              inputTheme={InputBoxTheme.copyToClipboardInputWhite}
              forDeposit={address}
            />
          </div>
        </div>
      )}

      {errorFetchingChannel && (
        <div
          className={classNames(
            styles.transferInformation,
            styles.channelFetchError
          )}
        >
          <p>Wallet address currently not available.</p>
        </div>
      )}

      <div className={styles.formGroupContainer}>
        <span>Conversion Calculator</span>
        <div className={styles.inputContainer}>
          <NumberCommaInput
            value={inputAmount}
            min={0}
            max={2000}
            onChange={setInputAmount}
            onClick={selectContent}
          />
          <div className={styles.inputRightContainer}>
            <div className={styles.coinWrapper}>
              <span>{cryptoShortName[selectedCurrency.label]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.overview}>
        <p className={styles.title}>
          Deposit Overview
        </p>
        <div className={styles.overviewItem}>
          <span>Estimate</span><span>{numberWithCommas(tokenValue)} {TOKEN_NAME}</span>
        </div>
        <hr/>
        <div className={styles.overviewItem}>
          <span>Bonus</span><span className={styles.bonus}>{numberWithCommas(bonus)} {TOKEN_NAME}</span>
        </div>
        <hr/>
        <div className={styles.overviewItem}>
          <span className={styles.total}>Total</span><span className={styles.total}>{numberWithCommas(parseFloat(tokenValue) + parseFloat(bonus))} {TOKEN_NAME}</span>
        </div>
        <hr/>
      </div>

      <div className={styles.summary}>
        <span>Add to Alpacasino Account in WFAIR</span>
        <p className={styles.summaryTotal}>{numberWithCommas(parseFloat(tokenValue) + parseFloat(bonus))} {TOKEN_NAME}</p>
      </div>

      {!errorFetchingChannel && (
        (selectedCurrency.label === 'BITCOIN' &&
            <p className={styles.depositNotes}>
              
              <sup>*</sup>Send any amount of BTC to the following address. 1 confirmation is required. We do not accept BEP20 from Binance.
              Alpacasino does not accept bitcoin that originates from any Mixing services; please refrain from depositing directly or indirectly from these services.
            </p>
          )
        ||
        (selectedCurrency.label === 'ETHEREUM' &&
          <p className={styles.depositNotes}>
            
            <sup>*</sup>Send any amount of ETH to the following address. 3 confirmations is required.
            Alpacasino does not accept Ethereum that originates from any Mixing services; please refrain from depositing directly or indirectly from these services.
          </p>
        )
        ||
        (selectedCurrency.label === 'LITECOIN' &&
          <p className={styles.depositNotes}>
            
            <sup>*</sup>Send any amount of LTC to the following address. 3 confirmations is required.
            Alpacasino does not accept Litecoin that originates from any Mixing services; please refrain from depositing directly or indirectly from these services.
          </p>
        )
      )}
    </div>
  );
};

const mapStateToProps = state => {
  const user = state.authentication;
  return {
    user,
  };
};


const mapDispatchToProps = dispatch => {
  return { 
    showWalletDepositPopup: () => { 
      dispatch(PopupActions.show({ popupType: PopupTheme.walletDeposit }));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepositCrypto);

