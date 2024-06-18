export const Name2Id = (Name: string) => {
  return Name.replace(/ /g, '-').toLowerCase()
}
