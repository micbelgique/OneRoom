export class EndPointGetter {

  public static getEndPointWithGameId(): string {
    return localStorage.getItem('endpoint') + '/Games/' + localStorage.getItem('gameId');
  }

}
