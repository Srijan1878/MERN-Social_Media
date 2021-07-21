import React from 'react'
import {motion} from 'framer-motion'

export default function Page() {
    return (
        <motion.div initial={{opacity:0,y:-100}} animate={{opacity:1,y:0}} transition={{duration:2}} >
            Your first weShare page!
        </motion.div>
    )
}
