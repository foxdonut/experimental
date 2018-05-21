import m from 'mithril'

export default {
  view: v =>
    v.children[0].children(v.state),

  oninit: v => {
    Object.assign(v.state, {
      value:    void 0,
      error:    void 0,
      resolved: false,
      rejected: false,
      pending:  true,
      settled:  false,
    });

    return v.attrs.promise.then(value => {
      v.state.value = value;
      v.state.resolved = true;
    }).catch(err => {
      v.state.error = err;
      v.state.rejected = true;
    }).finally(() => {
      v.state.pending = false;
      v.state.settled = true;

      m.redraw();
    });
  },

  onbeforeupdate: (now, then) => {
    if(now.attrs.promise !== then.attrs.promise)
      now.tag.oninit(now)
  }
}
