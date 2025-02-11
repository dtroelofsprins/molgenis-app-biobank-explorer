<template>
  <!-- template -->
  <article
    :class="[
      {
        'border-secondary': biobankInSelection,
        'border-light': !biobankInSelection,
        'back-side': showCollections,
      },
      fullSize ? 'biobank-card-large' : 'biobank-card',
      'flip',
    ]">
    <div tabindex="0">
      <section>
        <div v-if="loading" class="loading-screen">
          <span class="fa fa-spinner fa-spin fa-lg" aria-hidden="true"></span>
        </div>
        <div v-else>
          <header class="border-0 card-header p-1">
            <h5 class="p-1 pb-0 mt-1">
              <router-link
                :to="'/biobank/' + biobank.id"
                title="Biobank details"
                class="text-dark">
                <span
                  class="fa fa-server mr-2 text-primary"
                  aria-hidden="true"></span>
                <span class="biobank-name">{{ biobank.name }}</span>
                <sup
                  v-if="hasBiobankQuality"
                  class="
                    fa fa-check-circle-o
                    text-success
                    certificate-icon
                    ml-1
                  "
                  aria-hidden="true"></sup>
              </router-link>
            </h5>
          </header>

          <div class="shadow-sm" v-if="numberOfCollections">
            <button
              class="btn btn-link text-info pl-2"
              @click.prevent="showCollections = true">
              {{ uiText["card_collections_details"] }}
            </button>
          </div>
          <div class="p-2 pt-1 biobank-section" :style="cardContainerHeight">
            <small>
              <view-generator :viewmodel="biobankcardViewmodel" />
              <router-link
                :to="'/biobank/' + biobank.id"
                :title="`${biobank.name} details`"
                class="text-info ml-1">
                <span>More details</span>
              </router-link>
            </small>
          </div>
        </div>
      </section>
      <section>
        <div v-if="loading" class="loading-screen">
          <span class="fa fa-spinner fa-spin fa-lg" aria-hidden="true"></span>
        </div>
        <!-- We need to hide this, because you cannot have two scrollbars at the same time. -->
        <div v-if="!loading && showCollections">
          <header class="border-0 card-header p-1">
            <h5 class="pt-1 pl-1 pr-1 mt-1">
              <router-link
                :to="'/biobank/' + biobank.id"
                title="Biobank details"
                class="text-dark">
                <span
                  class="fa fa-server mr-2 text-primary"
                  aria-hidden="true"></span>
                <span class="biobank-name">{{ biobank.name }}</span>
                <sup
                  v-if="hasBiobankQuality"
                  class="
                    fa fa-check-circle-o
                    text-success
                    certificate-icon
                    ml-1
                  "
                  aria-hidden="true"></sup>
              </router-link>
            </h5>
          </header>
          <div class="d-flex mb-1 shadow-sm">
            <button
              class="btn btn-link text-info pl-2"
              @click.prevent="showCollections = false">
              {{ uiText["card_biobank_details"] }}
            </button>
          </div>
          <div class="collections-section" :style="cardContainerHeight">
            <div class="pl-2 pt-2 d-flex" v-if="numberOfCollections">
              <h5>
                {{ numberOfCollections }} collection{{
                  numberOfCollections === 1 ? "" : "s"
                }}
                available
              </h5>

              <collection-selector
                v-if="numberOfCollections > 1"
                class="text-right mr-1 ml-auto align-self-center"
                :collectionData="biobank.collections"
                bookmark
                iconOnly
                multi></collection-selector>
            </div>
            <div class="pl-2" v-if="!numberOfCollections">
              This biobank has no collections yet.
            </div>
            <div
              class="collection-items mx-1"
              v-for="(collectionDetail, index) of biobank.collectionDetails"
              :key="collectionDetail.id">
              <div v-if="showCollections" class="mb-2">
                <div class="pl-2 py-2 d-flex">
                  <router-link
                    :to="'/collection/' + collectionDetail.id"
                    title="Collection details"
                    class="text-dark">
                    <span
                      class="
                        fa fa-server
                        collection-icon
                        fa-lg
                        mr-2
                        text-primary
                      "
                      aria-hidden="true"></span>
                    <span class="collection-name">{{
                      collectionDetail.name
                    }}</span>
                  </router-link>
                  <div class="ml-auto">
                    <collection-selector
                      class="ml-auto"
                      :collectionData="collectionDetail"
                      iconOnly
                      bookmark></collection-selector>
                  </div>
                </div>

                <small>
                  <view-generator
                    class="p-2 pt-2"
                    :viewmodel="collectionViewmodel(collectionDetail)"/>
                  <router-link
                    :to="'/collection/' + collectionDetail.id"
                    :title="`${collectionDetail.name} details`"
                    class="text-info ml-2 pl-1">
                    <span>More details</span>
                  </router-link>
                </small>
                <hr v-if="index != lastCollection" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </article>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import {
  getBiobankDetails,
  getCollectionDetails
} from '../../utils/templateMapper'
import ViewGenerator from '../generators/ViewGenerator.vue'
import CollectionSelector from '../buttons/CollectionSelector.vue'

export default {
  name: 'biobank-card',
  components: {
    ViewGenerator,
    CollectionSelector
  },
  props: {
    fullSize: {
      type: Boolean,
      default: () => false
    },
    biobank: {
      type: [Object, String]
    }
  },
  data () {
    return {
      biobankSelected: false,
      showCollections: false
    }
  },
  methods: {
    getCollectionDetails,
    collectionViewmodel (collectiondetails) {
      const attributes = []
      for (const item of this.collectionColumns) {
        if (item.showOnBiobankCard) {
          attributes.push(
            collectiondetails.viewmodel.attributes.find(
              vm => vm.label === item.label
            )
          )
        }
      }
      return { attributes }
    }
  },
  computed: {
    ...mapState([
      'biobankColumns',
      'collectionColumns',
      'biobankCardShowCollections'
    ]),
    ...mapGetters(['selectedCollections', 'uiText']),
    lastCollection () {
      return this.biobank.collectionDetails.length - 1
    },
    numberOfCollections () {
      return this.biobank.collections ? this.biobank.collections.length : 0
    },
    cardContainerHeight () {
      const charactersInName = this.biobank.name.length

      let height = 20.5 // default

      if (charactersInName <= 30) {
        height = 22.2
      }

      /** When a biobank name is too long it will take three rows (most of the time), tipping point is 80 characters. */
      if (charactersInName >= 80) {
        height = 19
      }

      return `height: ${height}rem;max-height: ${height}rem;`
    },
    biobankcardViewmodel () {
      // check if biobank is still loading
      if (this.loading) return {}

      const { viewmodel } = getBiobankDetails(this.biobank)
      const attributes = []

      for (const item of this.biobankColumns) {
        if (item.showOnBiobankCard) {
          attributes.push(
            viewmodel.attributes.find(vm => vm.label === item.label)
          )
        }
      }
      return { attributes }
    },
    hasBiobankQuality () {
      return this.biobankcardViewmodel.attributes.some(
        attr => attr.type === 'quality' && attr.value && attr.value.length
      )
    },
    /** broken */
    biobankInSelection () {
      if (!this.biobank.collections) return false

      const biobankCollectionSelection = this.biobank.collections
        .filter(bcf => !bcf.parent_collection)
        .map(bc => ({ label: bc.label || bc.name, value: bc.id }))
      return this.selectedCollections
        .map(sc => sc.value)
        .some(id => biobankCollectionSelection.map(pc => pc.value).includes(id))
    },
    loading () {
      return typeof this.biobank === 'string'
    }
  },
  mounted () {
    this.showCollections = this.biobankCardShowCollections
  }
}
</script>

<style scoped>
.collection-icon {
  position: relative;
  top: 0.25em;
  clip-path: inset(-15% 0% 75% 0%);
}

.certificate-icon {
  font-size: 0.8rem;
}
</style>

<style>
.loading-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.btn-link:focus {
  box-shadow: none;
}

.biobank-section,
.collections-section {
  overflow: auto;
}

.collection-items {
  word-break: break-word;
}

.collection-items th {
  width: 25%;
}

.biobank-card {
  width: 25rem;
}

.biobank-card-large {
  width: 90% ;
}

.biobank-card > header,
.collection-header {
  display: flex;
  min-height: 3rem;
  flex-direction: column;
  justify-content: center;
}

/* TODO put in theme */
.card-header {
  background-color: #efefef;
}

/** Flip card */
article {
  padding: 1.5rem;
}

article footer {
  padding: 1.5rem 0 0 0;
}
article.flip {
  padding: 0;
  position: relative;
  height: 28rem;
  perspective: 1000px;
}

article.flip div[tabindex="0"] {
  box-shadow: 0 6.4px 14.4px 0 rgba(0, 0, 0, 0.132),
    0 1.2px 3.6px 0 rgba(0, 0, 0, 0.108);
}

article.flip div[tabindex="0"]:focus {
  outline: none !important;
}

article.flip [tabindex="0"] section {
  background-color: #fff;
  border: 0.1px solid #fff;
}

article.flip.back-side > [tabindex="0"] {
  transform: rotateY(180deg);
}
article.flip [tabindex="0"] {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
}

article.flip [tabindex="0"] section {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  /* Safari */
  backface-visibility: hidden;
  box-sizing: border-box;
  visibility: visible;
  -webkit-perspective: 0;
  perspective: 0;
}

article.flip [tabindex="0"] section:last-child {
  transform: rotateY(180deg);
}

/** ~~~ */
</style>
