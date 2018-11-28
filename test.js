async function asyncFunc() {
  return await Promise.resolve('asda');
}

async function main() {
  console.log(await asyncFunc());
}

main()
