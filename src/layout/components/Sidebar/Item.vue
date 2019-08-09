<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []
    if (icon) {
      if (icon === 'star-on') {
        vnodes.push(<i class='el-icon-star-on centerStyle' ></i>)
      } else if (icon === 'service') {
        vnodes.push(<i class='el-icon-service centerStyle' ></i>)
      } else {
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
<style lang="scss" scoped>
.centerStyle{
  margin-right:7px;
  text-align: left;
  margin-left: -2px
}
</style>
