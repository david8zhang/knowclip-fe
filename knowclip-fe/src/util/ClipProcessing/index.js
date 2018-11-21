export const sortClips = (clips, clipsToShow) => {
  switch (clipsToShow) {
    case 'Most Recent': {
      return clips.sort((a, b) => {
        const timeA = new Date(a)
        const timeB = new Date(b)
        return timeB.getTime() - timeA.getTime()
      })
    }
    case 'Most Viewed': {
      const sortedClips = clips.sort((a, b) => {
        const viewsA = a.view_count
        const viewsB = b.view_count
        return viewsB - viewsA
      })
      return sortedClips
    }
    case 'Most Likes': {
      return clips
    }
    default:
      return clips
  }
}
