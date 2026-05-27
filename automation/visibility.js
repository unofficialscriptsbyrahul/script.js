export function isVisible(el){

  if(!el) return false;

  const rect =
  el.getBoundingClientRect();

  return (

    rect.width > 0 &&
    rect.height > 0 &&

    rect.top < window.innerHeight &&
    rect.bottom > 0

  );

}
