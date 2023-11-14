import React, { useEffect } from "react";

interface ToasterDurationProps {
    duration: number;
    onHide: () => void;
}

const ToasterDuration: React.FunctionComponent<ToasterDurationProps> = ({duration, onHide}) => {

    useEffect(() => {
        if(duration) {
            const cleanup = setTimeout(onHide, duration)
            
            return () => clearTimeout(cleanup)
        }
    }, [duration])

    return null
}

export default ToasterDuration