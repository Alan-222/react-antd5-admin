import { JSEncrypt } from 'jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey =
  '-----BEGIN PUBLIC KEY-----\n' +
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDD9jPrqMszgk/eFAhSw9uBkd69\n' +
  '+26aOERIte9b7Vpjnf3gWzo1l2k21ecgFNyAs/WFxoQqE3EPQrct4NW55tGH5zK7\n' +
  '6v7/bPMTUUl3Sm2XSP54JHxDmdkiPkZqksgZFC/CkyFEHNHd09UJLdtqI5+9HV9C\n' +
  'Iu30SpBze0dVUkNMBQIDAQAB\n' +
  '-----END PUBLIC KEY-----'

const privateKey =
  '-----BEGIN PRIVATE KEY-----\n' +
  'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMP2M+uoyzOCT94U\n' +
  'CFLD24GR3r37bpo4REi171vtWmOd/eBbOjWXaTbV5yAU3ICz9YXGhCoTcQ9Cty3g\n' +
  '1bnm0YfnMrvq/v9s8xNRSXdKbZdI/ngkfEOZ2SI+RmqSyBkUL8KTIUQc0d3T1Qkt\n' +
  '22ojn70dX0Ii7fRKkHN7R1VSQ0wFAgMBAAECgYAMKegnJJ8YX2pdupiZqpahgFB3\n' +
  'Mng3Em8KpGBrMFx/+nqbxo3ibbeWM8jY8PKO+pyu5RenFPXboKSGMIKTu4Qd85Rr\n' +
  'dED9o3VYLpPBSPJxLeVYfHc0/irjTPpGcM2gjggibRqRMxeHH8HU6KsFQ2KFX5u5\n' +
  'LY9IzoZGaRoe8ErBAQJBAPHykgstNbnkYuLhTpwZ7D8HMdIvcLscLkfBfHf4iLrd\n' +
  'pZAb4jB9m0uj1HdSW36Ej/YLzI+plVIwBDgqLHp4N9ECQQDPV+LYvklLKSR6vsJw\n' +
  'K0JNRKefmQDZNS7fw+WarkBSu441TXs+F7UcJNRl/TsMU0Mrybfy5FEDAbqQ3Ldq\n' +
  'sRH1AkEA7KwISH6VC55pTN5w8yo4ev8isSRO9fl/HBodE44+0ex3RBzCigSUoM1F\n' +
  'zOL3NS+fU2P/WpjcxGTL+9TlZXerwQJAY9XpgHt/RxV0XzXi4aeysQnRvGMrqWqW\n' +
  'O2BT+frVNgDhJIE+SlOX/QkuzDz2ZaThvv/N9sJAz7XRY1cjadgA0QJBAKDFiBx+\n' +
  'tEoezZ2PvdEfNHbrzdlwpc3MBztLd11xDkQoHYaABv0J/fzvuWx/OYe2W8TTTcZl\n' +
  '+9DbiROjAgP67H4=\n' +
  '-----END PRIVATE KEY-----'

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}
