export function generateRandomEmail() {
    return `auto_${Date.now()}_${Math.floor(Math.random() * 1000)}@mailinator.com`;
  }
  
  export function generateUSMobile() {
    const areaCode = Math.floor(200 + Math.random() * 800);
    const centralOfficeCode = Math.floor(200 + Math.random() * 800);
    const lineNumber = Math.floor(1000 + Math.random() * 9000);
    return `${areaCode}${centralOfficeCode}${lineNumber}`;
  }
  
  export function generateStrongPassword() {
    return `Auto@${Math.floor(Math.random() * 100000)}Aa`;
  }
  