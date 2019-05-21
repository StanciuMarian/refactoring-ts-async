export class Snippets {

    async onSubmitClick2() { 
    // stuff1
    await this.getPromiseA();
    // stuff2
    let b = await this.getPromiseB();
    // stuff3 with b
  }


  onSubmitClick3() { 
    // stuff1
    this.getPromiseA().then(() => {
      // stuff2
      this.getPromiseB().then(b => {
        // stuff3 with b
      });
    });
  }

  onSubmitClick4() { 
    // stuff1
    this.getPromiseA().then(() => {
      // stuff2
      return this.getPromiseB();
    }).then(b => {
      // stuff3 with b
    });
  }
  

  getPromiseB():Promise<string> {
    throw new Error("Method not implemented.");
  }
  getPromiseA():Promise<string> {
    throw new Error("Method not implemented.");
  }
  
}