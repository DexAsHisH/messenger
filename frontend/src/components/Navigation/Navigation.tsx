
import { useDispatch } from 'react-redux'
import { faCommentDots, faSignOutAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC, useCallback, useState } from "react"
import cx from 'classnames'
import { setAuthenticated } from '../../store/authentication';
import { setUserDetails } from '../../store/userDetails';
import "./Navigation.scss"
import { NavLink } from 'react-router-dom'

export interface INavigationItem {
    id: string,
    icon: React.ReactElement,
    label?: string,
    onClick?: () => void,
    target: string
}

interface INavigationProps {
    items: INavigationItem[]
}

export const Navigation: FC<INavigationProps> = ({ items, children }) => {

    const dispatch = useDispatch();

    const [activeItem, setActiveItem] = useState<string>(items[0].id);

    const handleLogout = useCallback(() => {
        dispatch(setAuthenticated(false))
        dispatch(setUserDetails({}))
    }, [dispatch])

    const handleItemClick = useCallback((item: INavigationItem) => {
        setActiveItem(item.id)
    }, [])


    return <div className="main-navigation">
        <div className="main-navigation__app-name"></div>
        <div className="main-navigation__logo"><FontAwesomeIcon icon={faCommentDots} size="2x" /></div>
        <div className="main-navigation__nav">

            {items.map(item => <NavLink key={item.id} className={cx("main-navigation__nav__nav-item", { 'main-navigation__nav__nav-item--active': item.id === activeItem })} to={item.target} onClick={() => handleItemClick(item)}>
                {item.icon}
                {item.label && <span>{item.label}</span>}
          </NavLink>)}

            <div className="main-navigation__nav__nav-bottom">
                <div className="main-navigation__nav__nav-item"><FontAwesomeIcon icon={faSignOutAlt} size="lg" onClick={handleLogout} /></div>
            </div>
        </div>
    </div>
}