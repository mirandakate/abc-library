import React, { useEffect } from "react";
import { StateProps } from ".";

interface ToasterDurationProps {
    state: StateProps;
    onHide: () => void;
}

const ToasterDuration: React.FunctionComponent<ToasterDurationProps> = ({state, onHide}) => {

    useEffect(() => {
        if(state.duration) {
            const cleanup = setTimeout(onHide, state.duration)
            
            return () => clearTimeout(cleanup)
        }
    }, [state])

    return null
}

export default ToasterDuration