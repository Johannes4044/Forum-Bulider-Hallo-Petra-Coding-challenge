interface LogoProps {
  size?: number
}

export function SimpleLogo({ size = 40 }: LogoProps) {
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '8px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <img
        src="/hallopetra.svg"
        alt="HalloPetra"
        width={size}
        height={size}
        style={{ objectFit: 'contain' }}
      />
    </div>
  )
}