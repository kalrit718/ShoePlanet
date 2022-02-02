$("header").html(`
    <nav>
    <div class="mainLogo">
        <h4>ShoePLANET</h4>
    </div>
    <ul class="nav-link">
        <li><a href="?gender=men">Mens</a></li>
        <li><a href="?gender=women">Womens</a></li>
        <li><a href="?gender=kid">Kids</a></li>
        <li><a href="?gender=baby">Babies</a></li>
        <li><a href="#footer">Contact</a></li>
    </ul>
    <div class="menuToggle" id="menuToggleId">
        <div class="menuLine1"></div>
        <div class="menuLine2"></div>
        <div class="menuLine3"></div>
    </div>
    </nav>
`);

$("footer").html(`
    <section>
    <h4>Quick Contact</h4><br><br>
    <div>
        <span class="myName">ShoePLANET</span>
        <span class="myAddress">No. 40, High Street, Street, Somerset, UK</span>
        <span class="myEmail">info@shoeplanet.co.uk</span>
    </div>
    </section>
    <section>
    <h4>Keep in Touch</h4><br><br>
    <form action="mailto:kalindu.rithmal@live.com" method="post">
        <input type="text" name="fname" id="fname" placeholder="Name" required><br>
        <input type="email" name="femail" id="femail" placeholder="Email" required><br>
        <div>
            <input type="checkbox" name="fcheckbox" id="fcheckbox">
            <label for="fcheckbox">I agree to get notifications.</label>
        </div><br>
        <button type="submit" id="fSubmitBtn" disabled>Submit</button>
    </form>
    </section>
    <section>
    <h4>Social Media</h4><br><br>
    <ul class="socialLinks">
        <li><a target="_blank" href="https://facebook.com/shoeplanetuk"><span>Facebook</span></a></li>
        <li><a target="_blank" href="https://www.linkedin.com/in//shoeplanetuk"><span>LinkedIn</span></a></li>
        <li><a target="_blank" href="https://twitter.com//shoeplanetuk"><span>Twitter</span></a></li>
        <li><a target="_blank" href="https://www.instagram.com//shoeplanetuk"><span>Instagram</span></a></li>
    </ul>
    </section>
`);

const menuToggle = document.querySelector(".menuToggle");
const nav = document.querySelector(".nav-link");
const formCheck = document.querySelector("#fcheckbox");
const formSubmitBtn = document.getElementById("fSubmitBtn");

menuToggle.addEventListener("click", () => {
    nav.classList.toggle("nav-active");
    menuToggle.classList.toggle("toggle");
});

formCheck.addEventListener("change", function() {
    if (this.checked == true) {
        formSubmitBtn.disabled = false;
    } 
    if (this.checked == false) {
        formSubmitBtn.disabled = true;
    }
});

formSubmitBtn.addEventListener("click", () => {
    alert("Subscribed!")
});