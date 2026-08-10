import VerificationScreen from './VerificationScreen'

interface Props {
  onVerifySuccess?: () => void
  onBack?: () => void
}

export default function OtpScreen({ onVerifySuccess, onBack }: Props) {
  return <VerificationScreen onVerifySuccess={onVerifySuccess} onBack={onBack} />
}
