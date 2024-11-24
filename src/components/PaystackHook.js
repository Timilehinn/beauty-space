import { usePaystackPayment } from 'react-paystack';
/**
 * 
 * @param {*} email Example: 123@gmail.com
 * @param {*} amount Example: 100, amount should be in naira
 * @param {*} onSuccess: func () => void;
 * @param {*} onClose:  func () => void;
 * @param {*} renderButton: JSX element; usage -> renderButton={(props) => <button onClick={() => props.onClick()}>click me</button}
 * @returns 
 */
export const PaystackHook = ({
    email,
    amount,
    onSuccess,
    onClose,
    renderButton
}) => {
  
  let config = {
    email,
    amount: amount * 100,
    reference: (new Date()).getTime().toString(),
    publicKey: `${process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_API_KEY}`,
    channels: ['card']
  }
  const initializePayment = usePaystackPayment(config);
  return (
    <>{renderButton({ onClick: () => initializePayment(onSuccess, onClose) })}</>
  );
};