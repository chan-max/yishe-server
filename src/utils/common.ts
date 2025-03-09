import { ApiProperty } from '@nestjs/swagger';


export function generateInviteCode(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let inviteCode = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    inviteCode += characters[randomIndex];
  }
  return inviteCode;
}


export function toSafeJSON(val:any){
  let res = {}
  try{
    res = JSON.parse(val);
  }catch(e){}

  return res;
}