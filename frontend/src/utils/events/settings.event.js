/** 
 * SET EVENT TO SHOW AND HIDE THE CONFIRM PASSWORD POPUP 
 * 
 * NOTE:
 * When we call innerHTML, replaceChildren, or any other method that 
 * changes the innerHTML of the component, all the events of the component are removed. Therefore, 
 * I have to set the event listener on the root element because it is not changing.
 * 
 * ALSO :
 *  if you se a setTimeout function, it is because the event 
 *  listener is set before the element is created. cuz of loading time
 */

function showPopupSetting() {
    const settings = document.querySelector("settings-page");
    const confirmPopup = document.createElement("comfirm-password-pop-up");
    settings.appendChild(confirmPopup);
    const close_popup = document.getElementById("setting_close_popup");
    close_popup.onclick = () => {
        confirmPopup.remove();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("root").addEventListener("click", (e) => {
        setTimeout(() => {
            if (e.target.id === "save_setting_btn")
                showPopupSetting();
        }, 1)
    });

    setTimeout(() => {
        document.getElementById("root").addEventListener("change", (e) => {
            if (e.target.id === "user_pfp") {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = () => {
                    const img = document.getElementsByClassName("settings_pfp_image")[0];
                    img.src = reader.result;
                }
                reader.readAsDataURL(file);
            }
        });
    }, 1500);
})