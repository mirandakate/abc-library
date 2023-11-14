import { usePathname } from "next/navigation";
import React from "react";

interface HeaderTitleProps {

}

const HeaderTitle: React.FunctionComponent<HeaderTitleProps> = (props) => {
    const pathname = usePathname()
    return (
        <div className="flex-1 flex items-center">
            {pathname.slice(1).replaceAll('-', ' ').replace(/(?:^[a-z]|\s[a-z])/g, (targetedText) => targetedText.toUpperCase())}
        </div>
    )
}

export default HeaderTitle