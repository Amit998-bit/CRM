import React from 'react'
import Lanyard from './Lanyard'


const LoginBlock = () => {
  return (
    <div>
      <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
    </div>
  )
}

export default LoginBlock
