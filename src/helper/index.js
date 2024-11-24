
export function calculateTotalPriceAndMinHours(services) {
  let totalPrice = 0;
  let totalMinHours = 0;
  
  for (let i = 0; i < services.length; i++) {
    if(services[i]?.type === 'home-service'){
      totalPrice += services[i].home_service_price;
    }else{
      totalPrice += services[i].price;
    }
    totalMinHours += services[i].min_hour;
  }
  
  return { totalPrice, totalMinHours };
}

