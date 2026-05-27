export function filterAmounts(amount){

  document
  .querySelectorAll("*")
  .forEach(el => {

    if(
      el.innerText?.includes("₹")
    ){

      if(
        el.innerText.includes(
          `₹${amount}`
        )
      ){

        el.style.display = "";

      }else{

        el.style.display = "none";

      }

    }

  });

}
