import { SidebarPage } from './app.po';

describe('sidebar App', function() {
  let page: SidebarPage;

  beforeEach(() => {
    page = new SidebarPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
