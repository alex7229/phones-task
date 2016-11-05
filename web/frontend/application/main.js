class Controller {

    static showLoginForm () {
        $.ajax('/index.php?route=loginForm')
            .done((result) => {
                $('.container').html(result);
            })
    }
    
    static showPublicPhonebook () {
        $.ajax('/index.php?route=public-phonebook')
            .done((result) => {
                $('.container').html(result);
            })
    }

    static showDetailedUserData (userId) {
        $.ajax('/index.php', {
             type: 'POST',
             data: {
                 route: 'public-phonebook-detailed',
                 userId
             }
        })
            .done((result) => {
                let user = new UserPhonebookView(result);
                const userHtml = user.generateHTML();
                let divSelector = `div[data-user-id="${userId}"]  div`;
                let viewSelector = `div[data-user-id="${userId}"] .show`;
                let hideSelector = `div[data-user-id="${userId}"] .hide`;
                $(divSelector).html(userHtml);
                $(viewSelector).css('display', 'none');
                $(hideSelector).css('display', 'inline-block')
            })
    }
    
    static hideDetailedUserData(userId) {
        let divSelector = `div[data-user-id="${userId}"]  div`;
        let viewSelector = `div[data-user-id="${userId}"] .show`;
        let hideSelector = `div[data-user-id="${userId}"] .hide`;
        $(divSelector).html('');
        $(viewSelector).css('display', 'inline-block');
        $(hideSelector).css('display', 'none')
    }
    
    static showMyContact() {
        $.ajax('/index.php', {
            type: 'POST', 
            data: {
                route: 'my-contact'
            }
        })
            .done(result => {
                let model = new MyContact(result);
                model.findLastId();
                let view = new MyContactView(model.userData, model.countries);
                const userHTML = view.generateHTML();
                $('.container').html(userHTML);
                model.addHandlersToButtons();
            })
    }

}

class UserPhonebookView {

    constructor (jsonData) {
        this.data = JSON.parse(jsonData)
    }

    generateHTML () {
        const address = this.generateAddressHTML();
        const phones = this.generatePhonesHTML();
        const emails = this.generateEmailsHTML();
        const clearDiv = UserPhonebookView.generateClearDiv();
        return address+phones+emails+clearDiv;
    }

    generatePhonesHTML () {
        const phones = this.data['phones'].map(phone => {
            return UserPhonebookView.generateRow(phone['phone'])
        }).join('');
        const header = UserPhonebookView.generateHeader('Phones');
        return `<div class="column center">${header+phones}</div>`
    }

    generateEmailsHTML () {
        const emails = this.data['emails'].map(email => {
            return UserPhonebookView.generateRow(email['email'])
        }).join('');
        const header = UserPhonebookView.generateHeader('Emails');
        return `<div class="column right">${header+emails}</div>`
    }

    generateAddressHTML () {
        const addressObj = this.data['mainData'][0];
        const header = UserPhonebookView.generateHeader('Address');
        const address = UserPhonebookView.generateRow(addressObj['address']);
        const zip = UserPhonebookView.generateRow(addressObj['zip_city']);
        const countryCode = UserPhonebookView.generateRow(addressObj['country_code']);
        return `<div class="column left">${header+address+zip+countryCode}</div>`
    }

    static generateClearDiv() {
        return `<div class="clear"></div>`
    }

    static generateRow (data) {
        return `<p class="phonebook row">${data}</p>`
    }

    static generateHeader (data) {
        return `<h4>${data}</h4>`
    }
}

class MyContact  {

    constructor (jsonData) {
        this.data = JSON.parse(jsonData);
        this.userData = this.data['userData'];
        this.countries = this.data['countries']
    }

    findLastId () {
        this.maxPhoneId = 1;
        this.maxEmailId = 1;
        this.userData['phones'].forEach(phone => {
            if (phone['phone_id'] > this.maxPhoneId) {
                this.maxPhoneId = phone['phone_id']
            }
        });
        this.userData['emails'].forEach(email => {
            if (email['email_id'] > this.maxEmailId) {
                this.maxEmailId = email['email_id']
            }
        })
    }

    addHandlersToButtons () {
        $('#addPhone').click(() => {
            this.addPhone()
        });
        $('#addEmail').click(() => {
            this.addEmail()
        });
        $('#myContactSubmit').click(() => {
            this.saveData()
        })
    }

    generatePhoneId() {
        this.maxPhoneId++;
        return this.maxPhoneId
    }

    generateNewEmailId() {
        this.maxEmailId++;
        return this.maxEmailId
    }

    addPhone() {
        const id = this.generatePhoneId();
        this.userData['phones'].push({
            phone_id: id,
            phone: '',
            public: 'false'
        });
        const phoneHTML = MyContactView.generatePhoneEmailRow(id, '', 'false', 'phone');
        MyContactView.appendPhoneHTML(phoneHTML)
    }

    addEmail () {
        const id = this.generateNewEmailId();
        this.userData['emails'].push({
            email_id: id,
            email: '',
            public: 'false'
        });
        const emailHTML = MyContactView.generatePhoneEmailRow(id, '', 'false', 'email');
        MyContactView.appendEmailHTML(emailHTML)
    }



    saveData () {
        let gather  = new MyContactGather(this.userData);
        gather.gatherAllUserData();
        $.ajax('index.php', {
            type: 'POST',
            data: {
                route: 'my-contact-update',
                userData: JSON.stringify(this.userData)
            }
        })
            .done((result)=> {
                $('.error').html('');
                $('.response').html(result);
            })
            .catch(err => {
                $('.response').html('');
                $('.error').html(err.responseText)
            })
    }
    
}

class MyContactView {

    constructor (userData, countries) {
        this.userData = userData;
        this.countries = countries
    }

    generateHTML () {
        const title = "<h1 class='header'>My Contact</h1>";
        const contact = this.generateContactHTML();
        const phones = this.generatePhonesHTML();
        const emails = this.generateEmailsHTML();
        const dataDiv = `<div id="userData">${contact+phones+emails}<div class="clear"></div></div>`;
        const submitBtn = MyContactView.generateSubmitButton();
        const isVisible = MyContactView.generatePublishBox(this.userData['mainData'][0]['isVisible']);
        const serverResponseField = MyContactView.generateServerResponseField();
        return title+isVisible+dataDiv+submitBtn+serverResponseField;

    }

    generateContactHTML() {
        const contact = this.userData['mainData'][0];
        const header = MyContactView.generateHeader('Contact');
        const firstName = MyContactView.generateContactRow('firstName', contact['first_name'], 'Firstname');
        const lastName = MyContactView.generateContactRow('lastName', contact['last_name'], 'Lastname');
        const address = MyContactView.generateContactRow('address', contact['address'], 'Address');
        const zipCity = MyContactView.generateContactRow('zipCity', contact['zip_city'], 'ZIP/City');
        const country = MyContactView.generateCountrySelect(contact['country_code'],this.countries);
        return `<div class="column left">${header+firstName+lastName+address+zipCity+country}</div>`
    }

    generatePhonesHTML () {
        const phones = this.userData['phones'];
        const header = MyContactView.generateHeader('Phones');
        const phonesHtml = phones.map(phone => {
            return MyContactView.generatePhoneEmailRow(phone['phone_id'], phone['phone'], phone['public'], 'phone')
        }).join('');
        const addPhoneBtn = MyContactView.generateAddPhoneButton();
        return `<div class="column center"><div>${header+phonesHtml}</div>${addPhoneBtn}</div>`
    }

    generateEmailsHTML () {
        const emails = this.userData['emails'];
        const header = MyContactView.generateHeader('Emails');
        const emailsHTML = emails.map(email => {
            return MyContactView.generatePhoneEmailRow(email['email_id'], email['email'], email['public'], 'email')
        }).join('');
        const addEmailBtn = MyContactView.generateAddEmailButton();
        return `<div class="column right"><div>${header+emailsHTML}</div>${addEmailBtn}</div>`
    }

    static generateServerResponseField() {
        return '<p class="response"></p><p class="error"></p>'
    }

    static generateCountrySelect(value, countries) {
        const options = countries.map(countryData => {
            const code = countryData['country_code'];
            const selected = value === code ? 'selected' : '';
            return ` <option value="${code}" ${selected}>${code}</option>`
        }).join('');
        const select = `<select id="countryCode" class="contact">${options}</select>`;
        const label = `<label class="contact" for="userCountry">Country</label>`;
        return label+select;
    }

    static generatePublishBox(isPublic) {
        const checkBoxValue = isPublic === 'true' ? 'checked' : "";
        const text = `<span>Publish my contact</span>`;
        const checkbox = `<input id="isPublic" type="checkbox" ${checkBoxValue}>`;
        return `<div id="isVisible">${text+checkbox}</div>`
    }

    static generateSubmitButton () {
        return '<button type="button" id="myContactSubmit">Save</button>'
    }

    static generateAddPhoneButton() {
        return '<button type="button" id="addPhone">Add phone</button>'
    }

    static generateAddEmailButton() {
        return '<button type="button" id="addEmail">Add email</button>'
    }

    static generateHeader (data) {
        return `<h4>${data}</h4>`
    }

    static generateContactRow (id, inputValue, labelValue) {
        const label = `<label class="contact" for="${id}">${labelValue}</label>`;
        const input = `<input class="contact" id=${id} value="${inputValue}">`;
        return label+input+'<br>';
    }

    static generatePhoneEmailRow (id, value, isPublic, type) {
        const checkBoxValue = isPublic === 'true' ? 'checked' : "";
        const input = `<input type="text" value="${value}">`;
        const checkBox = `<input type="checkbox" ${checkBoxValue}>`;
        return `<div id="${type+id}">${input+checkBox}</div>`
    }

    static appendPhoneHTML (html) {
        $(html).insertBefore('#addPhone')
    }

    static appendEmailHTML(html) {
        $(html).insertBefore('#addEmail')
    }

}

class MyContactGather {

    constructor (userData) {
        this.userData = userData;
    }

    gatherAllUserData () {
        this.updateContactData();
        this.updateEmailsData();
        this.updatePhonesData();
    }

    updateContactData() {
        let contact = this.userData['mainData'][0];
        contact['address'] = MyContactGather.getInputValue('#address');
        contact['country_code'] = MyContactGather.getInputValue('#countryCode');
        contact['first_name'] = MyContactGather.getInputValue('#firstName');
        contact['last_name'] = MyContactGather.getInputValue('#lastName');
        contact['zip_city'] = MyContactGather.getInputValue('#zipCity');
        contact['isVisible'] = MyContactGather.getCheckboxValue('#isPublic');
    }

    updatePhonesData() {
        this.userData['phones'] = this.userData['phones'].map(item => {
            const id = item[`phone_id`];
            const inputSel = `#phone${id} [type="text"]`;
            const checkSel = `#phone${id} [type="checkbox"]`;
            return {
                'phone': MyContactGather.getInputValue(inputSel),
                'phone_id': id,
                'isPublic': MyContactGather.getCheckboxValue(checkSel)
            };
        });
    }

    updateEmailsData() {
        this.userData['emails'] = this.userData['emails'].map(item => {
            const id = item[`email_id`];
            const inputSel = `#email${id} [type="text"]`;
            const checkSel = `#email${id} [type="checkbox"]`;
            return {
                'email': MyContactGather.getInputValue(inputSel),
                'email_id': id,
                'isPublic': MyContactGather.getCheckboxValue(checkSel)
            };
        });
    }

    static getInputValue(selector) {
        return $(selector).val()
    }

    static getCheckboxValue(selector) {
        return $(selector).prop('checked') ? 'true' : 'false'
    }

}


