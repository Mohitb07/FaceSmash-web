export const convertImageObject = (e: React.ChangeEvent<HTMLInputElement>) => {
  if(e.target.files && e.target.files[0]){
    return e.target.files[0];
  }
  throw new Error('image cannot be converted')
};
