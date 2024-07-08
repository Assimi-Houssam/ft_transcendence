/** 
 * SET EVENT TO SHOW AND HIDE THE CONFIRM PASSWORD POPUP 
 * 
 * NOTE:
 * When we call innerHTML, replaceChildren, or any other method that 
 * changes the innerHTML of the component, all the events of the component are removed. Therefore, 
 * I have to set the event listener on the root element because it is not changing.
 */

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("root").addEventListener("click", (e) => {
        setTimeout(() => {
            if (e.target.id === "save_setting_btn") {
                const settings = document.querySelector("settings-page");
                const confirmPopup = document.createElement("comfirm-password-pop-up");
                settings.appendChild(confirmPopup);
                const close_popup = document.getElementById("setting_close_popup");
                close_popup.onclick = () => {
                    confirmPopup.remove();
                }
            }
        }, 1)
    })
})