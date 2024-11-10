'use client'
import {FundButton, getOnrampBuyUrl} from '@coinbase/onchainkit/fund';
import {useAccount} from 'wagmi';
const projectId = process.env.NEXT_PUBLIC_CDP_PROJECT_ID;
export function Fund(){
    const {address} = useAccount();
    const onrampBuyUrl = getOnrampBuyUrl({
        projectId,
        addresses: {[address]: ['base']},
        assets: ['BTC'],
        presetFiatAmount: 5,
        fiatCurrency: 'USD'
    });
    return <FundButton fundingUrl={onrampBuyUrl} />
}
