import { useCallback } from 'react';

import { useHoverDropdown } from '@app/hooks/useHoverDropdown';
import { useUserContext } from '@magento/peregrine/lib/context/user';

/**
 * The useAccountTrigger talon complements the AccountTrigger component.
 *
 * @returns {Object}    talonProps
 * @returns {Boolean}   talonProps.accountMenuIsOpen - Whether the menu that this trigger toggles is open or not.
 * @returns {Function}  talonProps.setAccountMenuIsOpen  - Set the value of accoutMenuIsOpen.
 * @returns {Ref}       talonProps.accountMenuRef - A React ref to the menu that this trigger toggles.
 * @returns {Ref}       talonProps.accountMenuTriggerRef - A React ref to the trigger element itself.
 * @returns {Function}  talonProps.handleTriggerClick - A function for handling when the trigger is clicked.
 */
export const useAccountTrigger = () => {
    const {
        elementRef: accountMenuRef,
        expanded: accountMenuIsOpen,
        setExpanded: setAccountMenuIsOpen,
        triggerRef: accountMenuTriggerRef
    } = useHoverDropdown(300);

    const handleTriggerClick = useCallback(() => {
        // Toggle the Account Menu.
        setAccountMenuIsOpen(isOpen => !isOpen);
    }, [setAccountMenuIsOpen]);

    const [{ isSignedIn: isUserSignedIn }] = useUserContext();

    const handleTriggerHover = useCallback(() => {
        if (isUserSignedIn) {
            setAccountMenuIsOpen(isOpen => !isOpen);
        }
    }, [setAccountMenuIsOpen, isUserSignedIn]);

    return {
        accountMenuIsOpen,
        accountMenuRef,
        accountMenuTriggerRef,
        setAccountMenuIsOpen,
        handleTriggerClick,
        handleTriggerHover
    };
};
