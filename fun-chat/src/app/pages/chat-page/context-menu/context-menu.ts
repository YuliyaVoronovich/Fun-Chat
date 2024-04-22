import { BaseComponent } from '../../../components/base-component';
import './context-menu.scss';
import { Button } from '../../../components/button/button';

export class ContextMenu extends BaseComponent {
  constructor(id: string, text: string, editMsg: (id: string, text: string) => void, deleteMsg: (id: string) => void) {
    super({ tag: 'div', className: 'context-menu card' });
    const editBtn = new Button({
      type: 'button',
      className: 'context-menu-link',
      textContent: 'Edit',
      onClick: () => {
        editMsg(id, text);
      },
    });
    const deleteBtn = new Button({
      type: 'button',
      className: 'context-menu-link',
      textContent: 'Delete',
      onClick: () => {
        deleteMsg(id);
      },
    });
    this.appendChildren([editBtn, deleteBtn]);
  }
}
